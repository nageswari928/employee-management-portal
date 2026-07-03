import React, { useState } from 'react';
import { useAppContext } from '../App';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { User, Mail, Phone, MapPin, Award, Calendar, Briefcase, FileText } from 'lucide-react';

export const Profile = () => {
  const { profile, updateProfile, setLogoutOpen } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields State
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [department, setDepartment] = useState(profile.department);
  const [role, setRole] = useState(profile.role);
  const [joiningDate, setJoiningDate] = useState(profile.joiningDate);
  const [address, setAddress] = useState(profile.address);
  const [skills, setSkills] = useState(profile.skills);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to current profile data
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
    setDepartment(profile.department);
    setRole(profile.role);
    setJoiningDate(profile.joiningDate);
    setAddress(profile.address);
    setSkills(profile.skills);
    setMessageType('success');
    setMessage('Changes discarded.');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setMessage('');

    // Validation
    const errors = [];
    if (!name || name.trim().length === 0) {
      errors.push('Name is required.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('A valid email is required.');
    }
    if (!phone || phone.trim().length === 0) {
      errors.push('Phone number is required.');
    }

    if (errors.length > 0) {
      setMessageType('error');
      setMessage(errors.join(' '));
      return;
    }

    const updatedProfile = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
      role: role.trim(),
      joiningDate,
      address: address.trim(),
      skills: skills.trim(),
    };

    updateProfile(updatedProfile);
    setIsEditing(false);
    setMessageType('success');
    setMessage('Profile updated successfully.');
  };

  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background text-foreground font-sans">
      {/* Topbar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card shadow-sm shrink-0">
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Account</p>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Profile</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setLogoutOpen(true)}
            data-testid="logout-btn"
            className="border-border text-foreground hover:bg-muted"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Overview Card */}
          <Card className="border-border bg-card shadow-sm flex flex-col items-center p-6 text-center h-fit">
            <div 
              id="profileAvatar"
              className="w-24 h-24 rounded-full bg-primary text-primary-foreground text-3xl font-extrabold flex items-center justify-center shadow-lg border-4 border-card"
            >
              {getInitials(profile.name)}
            </div>
            <h2 id="profileName" className="text-xl font-bold text-foreground mt-4 leading-tight">
              {profile.name}
            </h2>
            <p id="profileRole" className="text-sm text-muted-foreground font-medium mt-1">
              {profile.role}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
              <Badge variant="success" className="py-0.5 px-2">Active</Badge>
              <Badge variant="secondary" className="py-0.5 px-2">{profile.department}</Badge>
            </div>

            <div className="w-full border-t border-border mt-6 pt-6 space-y-4 text-left text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4.5 w-4.5 text-primary" />
                <span className="truncate text-foreground font-medium">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4.5 w-4.5 text-primary" />
                <span className="text-foreground font-medium">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-4.5 w-4.5 text-primary" />
                <span className="text-foreground font-medium">Joined {new Date(profile.joiningDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </Card>

          {/* Right Column - User Info Form */}
          <Card className="lg:col-span-2 border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
              <div>
                <CardTitle className="text-base font-bold text-foreground">Personal Information</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Update your personal and organizational portal details.</p>
              </div>
              
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    id="editProfileBtn"
                    data-testid="edit-profile-btn"
                    onClick={handleEdit}
                    className="bg-primary text-primary-foreground font-semibold"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      id="saveProfileBtn"
                      data-testid="save-profile-btn"
                      onClick={handleSave}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                    >
                      Save
                    </Button>
                    <Button
                      id="cancelProfileBtn"
                      data-testid="cancel-profile-btn"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-border text-foreground hover:bg-muted"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form id="profileForm" className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {/* Form Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5" htmlFor="profileNameInput">
                      <User className="h-3.5 w-3.5" /> Full Name
                    </label>
                    <Input
                      id="profileNameInput"
                      data-testid="profile-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className="bg-background border-input text-foreground disabled:bg-muted/40 disabled:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5" htmlFor="profileEmailInput">
                      <Mail className="h-3.5 w-3.5" /> Email Address
                    </label>
                    <Input
                      id="profileEmailInput"
                      data-testid="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className="bg-background border-input text-foreground disabled:bg-muted/40 disabled:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Form Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5" htmlFor="profilePhoneInput">
                      <Phone className="h-3.5 w-3.5" /> Phone Number
                    </label>
                    <Input
                      id="profilePhoneInput"
                      data-testid="profile-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className="bg-background border-input text-foreground disabled:bg-muted/40 disabled:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5" htmlFor="profileDepartmentInput">
                      <Briefcase className="h-3.5 w-3.5" /> Department
                    </label>
                    <Input
                      id="profileDepartmentInput"
                      data-testid="profile-department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      disabled={!isEditing}
                      className="bg-background border-input text-foreground disabled:bg-muted/40 disabled:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Form Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5" htmlFor="profileRoleInput">
                      <Award className="h-3.5 w-3.5" /> Job Role
                    </label>
                    <Input
                      id="profileRoleInput"
                      data-testid="profile-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled={!isEditing}
                      className="bg-background border-input text-foreground disabled:bg-muted/40 disabled:text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5" htmlFor="profileDateInput">
                      <Calendar className="h-3.5 w-3.5" /> Joining Date
                    </label>
                    <Input
                      id="profileDateInput"
                      data-testid="profile-joining-date"
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      disabled={!isEditing}
                      className="bg-background border-input text-foreground disabled:bg-muted/40 disabled:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Textareas */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5" htmlFor="profileAddressInput">
                    <MapPin className="h-3.5 w-3.5" /> Address
                  </label>
                  <textarea
                    id="profileAddressInput"
                    data-testid="profile-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={!isEditing}
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground disabled:bg-muted/40 disabled:text-muted-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5" htmlFor="profileSkillsInput">
                    <FileText className="h-3.5 w-3.5" /> Professional Skills
                  </label>
                  <textarea
                    id="profileSkillsInput"
                    data-testid="profile-skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    disabled={!isEditing}
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground disabled:bg-muted/40 disabled:text-muted-foreground"
                  />
                </div>

                {/* Message banner */}
                {message && (
                  <div 
                    id="profileMessage" 
                    className={`p-3 rounded-md text-xs font-semibold border text-center transition-all ${
                      messageType === 'error' 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-450' 
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450'
                    }`}
                  >
                    {message}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
