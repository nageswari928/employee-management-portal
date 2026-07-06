import os
import json
import datetime
import subprocess
from pymongo import MongoClient
from pymongo.errors import PyMongoError

def get_git_info():
    """Fallback helpers to get commit details locally."""
    try:
        commit_msg = subprocess.check_output(["git", "log", "-1", "--pretty=%B"], text=True).strip()
        author = subprocess.check_output(["git", "log", "-1", "--pretty=%an"], text=True).strip()
        # Changed files in last commit
        changed = subprocess.check_output(["git", "diff", "--name-only", "HEAD~1", "HEAD"], text=True).splitlines()
        return commit_msg, author, [f.strip() for f in changed if f.strip()]
    except Exception:
        try:
            # If HEAD~1 doesn't exist, just get status/diff
            changed = subprocess.check_output(["git", "diff", "--name-only", "HEAD"], text=True).splitlines()
            return "Local Commit", "Local Author", [f.strip() for f in changed if f.strip()]
        except Exception:
            return "Local Commit", "Local Author", []

def main():
    print("Starting build metadata upload to MongoDB...")
    
    # Defaults
    commit_msg = "Unknown commit message"
    author = "Unknown author"
    changed_files = []
    
    # Try reading from GHA event payload first
    event_path = os.getenv("GITHUB_EVENT_PATH")
    is_github_actions = False
    
    if event_path and os.path.exists(event_path):
        is_github_actions = True
        try:
            with open(event_path, "r", encoding="utf-8") as f:
                event_data = json.load(f)
            
            # Extract commit data for push events
            commits = event_data.get("commits", [])
            if commits:
                # Get the latest commit info
                latest_commit = commits[-1]
                commit_msg = latest_commit.get("message", "")
                author = latest_commit.get("author", {}).get("name", "")
                
                # Gather all unique changed files across all commits in this push
                all_changed = set()
                for c in commits:
                    all_changed.update(c.get("added", []))
                    all_changed.update(c.get("modified", []))
                    all_changed.update(c.get("removed", []))
                changed_files = list(all_changed)
            else:
                # If not a push event (e.g. workflow_dispatch), fall back to git command
                commit_msg, author, changed_files = get_git_info()
        except Exception as e:
            print(f"Error parsing GHA event payload: {e}")
            commit_msg, author, changed_files = get_git_info()
    else:
        # Local run fallback
        commit_msg, author, changed_files = get_git_info()

    # Collect pipeline run details
    run_id = os.getenv("GITHUB_RUN_ID")
    run_number = os.getenv("GITHUB_RUN_NUMBER")
    git_sha = os.getenv("GITHUB_SHA")
    branch = os.getenv("GITHUB_REF_NAME", "local-branch")
    repo = os.getenv("GITHUB_REPOSITORY", "employee-management-portal")
    event_name = os.getenv("GITHUB_EVENT_NAME", "manual")

    report_doc = {
        "repository": repo.split("/")[-1],
        "full_repository": repo,
        "branch": branch,
        "timestamp": datetime.datetime.now(datetime.timezone.utc),
        "trigger_event": event_name,
        "commit": {
            "sha": git_sha or "local",
            "message": commit_msg,
            "author": author
        },
        "build": {
            "run_id": run_id,
            "run_number": int(run_number) if run_number else None,
            "status": "completed"
        },
        "files_changed_count": len(changed_files),
        "changed_files": changed_files
    }

    # Connection URI
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
    
    print("Connecting to MongoDB...")
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        db = client["webhook"]
        collection = db["test-build"]
        
        # Verify connection
        client.admin.command('ping')
        
        # Insert report
        result = collection.insert_one(report_doc)
        print(f"[SUCCESS] Build metadata successfully saved to MongoDB database 'webhook', collection 'test-build'. Inserted ID: {result.inserted_id}")
        
    except PyMongoError as err:
        print(f"[WARNING] Failed to upload build metadata to MongoDB: {err}")
        print("Build pipeline continues unimpeded.")

if __name__ == "__main__":
    main()
