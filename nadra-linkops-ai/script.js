const STORAGE_KEY = 'nadra-network-complaint-state-v4';
const USERS_KEY = 'nadra-network-complaint-users-v4';
const SESSION_KEY = 'nadra-network-complaint-session-v4';
const ACTIVE_TAB_KEY = 'nadra-network-complaint-active-tab-v4';

const ROLE_PERMISSIONS = {
  'Admin': ['dashboard', 'complaints', 'reports', 'map', 'directory', 'technical-tasks', 'ad-support', 'users', 'ai-assistant', 'documentation'],
  'Network Engineer': ['dashboard', 'complaints', 'reports', 'map', 'directory', 'technical-tasks', 'ad-support', 'ai-assistant', 'documentation'],
  'Network Technician': ['dashboard', 'complaints', 'map', 'directory', 'technical-tasks', 'ai-assistant', 'documentation']
};

const MEDIA_OPTIONS = ['PTCL DSL', 'Wateen Telecom', 'VSAT DVBRCS', 'DRS', '3G/4G SIM', 'Fiber'];
const SITE_POSITION_OVERRIDES = {
  'NRC RHO Quetta (Quetta-III) Morning Shift': { mapX: 49, mapY: 53 },
  'NRC RHO Quetta (Quetta-III) Evening Shift': { mapX: 50, mapY: 55 },
  'Mega Center Morning Shift': { mapX: 52, mapY: 57 },
  'Mega Center Evening Shift': { mapX: 53, mapY: 59 },
  'NRC Pishin': { mapX: 45, mapY: 41 },
  'NRC Chaman': { mapX: 36, mapY: 29 },
  'NRC Qilla Abdullah': { mapX: 41, mapY: 35 },
  'NRC Loralai Morning Shift': { mapX: 64, mapY: 36 },
  'NRC Loralai Evening Shift': { mapX: 66, mapY: 38 },
  'NRC Harnai': { mapX: 59, mapY: 44 },
  'NRC Ziarat': { mapX: 55, mapY: 47 },
  'NRC Zhob': { mapX: 72, mapY: 24 },
  'NRC Sherani': { mapX: 76, mapY: 17 },
  'NRC Qillah Saifullah': { mapX: 58, mapY: 30 },
  'NRC Khuzdar': { mapX: 47, mapY: 72 },
  'NRC Dalbandin': { mapX: 24, mapY: 61 },
  'NRC Noshki': { mapX: 33, mapY: 58 },
  'NRC Sibi': { mapX: 66, mapY: 54 },
  'Verification Section RHO Quetta': { mapX: 54, mapY: 54 },
  'Project Site Taftan': { mapX: 16, mapY: 56 },
  'MRV Quetta Support Point': { mapX: 51, mapY: 60 }
};

const AI_SYSTEM_PROMPT = `You are NADRA LinkOps AI, an assistant supporting NADRA RHO Quetta Region network complaint operations.

Your tasks:
1. Review the complaint details and determine whether the issue is a genuine connectivity issue or a non-connectivity/local issue.
2. Estimate severity based on impact and available details.
3. Draft a formal and professional escalation email to the relevant telecom provider. The language must be official, respectful, and suitable for communication with higher authorities in CC.
4. Draft a formal update message for the site incharge.
5. Suggest practical next technical steps.

Rules:
- Use formal professional language.
- Mention site name, provider, complaint ID, disruption time, issue nature, and business impact.
- If evidence suggests a local/LAN/application-side issue, state that respectfully and clearly.
- Keep the output plain text with the following headings only:
  Classification
  Severity
  Escalation Email
  Site Update
  Next Technical Steps`;

const defaultSiteDirectory = [
  { id: 'dir-001', dauName: 'NRC RHO Quetta (Quetta-III) Morning Shift', type: 'DAU', district: 'Quetta', address: 'NRC RHO Zarghoon Road Quetta', timing: '8:00 AM - 10:00 PM', source: 'Public NADRA office listing', mapX: 46, mapY: 52 },
  { id: 'dir-002', dauName: 'NRC RHO Quetta (Quetta-III) Evening Shift', type: 'DAU', district: 'Quetta', address: 'NRC RHO Zarghoon Road Quetta', timing: '4:00 PM - 10:00 PM', source: 'Public NADRA office listing', mapX: 48, mapY: 54 },
  { id: 'dir-003', dauName: 'Mega Center Morning Shift', type: 'DAU', district: 'Quetta', address: 'NADRA Mega Centre near Alhamd Islamic University, Airport Road Quetta', timing: '8:00 AM - 10:00 PM', source: 'Public NADRA office listing', mapX: 50, mapY: 57 },
  { id: 'dir-004', dauName: 'Mega Center Evening Shift', type: 'DAU', district: 'Quetta', address: 'NADRA Mega Centre near Alhamd Islamic University, Airport Road Quetta', timing: '4:00 PM - 10:00 PM', source: 'Public NADRA office listing', mapX: 51, mapY: 58 },
  { id: 'dir-005', dauName: 'NRC Pishin', type: 'DAU', district: 'Pishin', address: 'Surkhab Road near Degree College Pishin', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 47, mapY: 43 },
  { id: 'dir-006', dauName: 'NRC Chaman', type: 'DAU', district: 'Chaman', address: 'Near DC Office Chaman', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 38, mapY: 26 },
  { id: 'dir-007', dauName: 'NRC Qilla Abdullah', type: 'DAU', district: 'Qilla Abdullah', address: 'Main Quetta-Chaman Road, Killa Abdullah', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 42, mapY: 36 },
  { id: 'dir-008', dauName: 'NRC Loralai Morning Shift', type: 'DAU', district: 'Loralai', address: 'Haji Majeed Colony near Sarkari Jar Loralai', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 67, mapY: 35 },
  { id: 'dir-009', dauName: 'NRC Loralai Evening Shift', type: 'DAU', district: 'Loralai', address: 'Haji Majeed Colony near Sarkari Jar Loralai', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 69, mapY: 37 },
  { id: 'dir-010', dauName: 'NRC Harnai', type: 'DAU', district: 'Harnai', address: 'Muhallah Jalal Abad Ganj Road Harnai', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 61, mapY: 42 },
  { id: 'dir-011', dauName: 'NRC Ziarat', type: 'DAU', district: 'Ziarat', address: 'Near ZTBL, Quetta Ziarat Road', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 56, mapY: 46 },
  { id: 'dir-012', dauName: 'NRC Zhob', type: 'DAU', district: 'Zhob', address: 'Near DC Complex, Stadium Muhalla Zhob', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 76, mapY: 23 },
  { id: 'dir-013', dauName: 'NRC Sherani', type: 'DAU', district: 'Sherani', address: 'RHC Building, D.I. Khan Road Mani Khwah', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 84, mapY: 18 },
  { id: 'dir-014', dauName: 'NRC Qillah Saifullah', type: 'DAU', district: 'Qilla Saifullah', address: 'Near DC Complex, Killa Saifullah', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 59, mapY: 28 },
  { id: 'dir-015', dauName: 'NRC Khuzdar', type: 'DAU', district: 'Khuzdar', address: 'DC Office Khuzdar', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 45, mapY: 78 },
  { id: 'dir-016', dauName: 'NRC Dalbandin', type: 'DAU', district: 'Chaghi', address: 'Killi Khuda Rahim London Road Dalbandin', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 19, mapY: 66 },
  { id: 'dir-017', dauName: 'NRC Noshki', type: 'DAU', district: 'Noshki', address: 'Killi Shareef Khan Road near Civil Hospital Noshki', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 31, mapY: 60 },
  { id: 'dir-018', dauName: 'NRC Sibi', type: 'DAU', district: 'Sibi', address: 'Thandi Road, Sibi', timing: '8:30 AM - 4:30 PM', source: 'Public NADRA office listing', mapX: 69, mapY: 56 },
  { id: 'dir-019', dauName: 'Verification Section RHO Quetta', type: 'Section', district: 'Quetta', address: 'RHO Quetta Verification Section', timing: 'Office Hours', source: 'Internal update', mapX: 53, mapY: 55 },
  { id: 'dir-020', dauName: 'Project Site Taftan', type: 'Project Site', district: 'Chaghi', address: 'Project location Taftan region', timing: 'Operational Hours', source: 'Internal update', mapX: 10, mapY: 58 },
  { id: 'dir-021', dauName: 'MRV Quetta Support Point', type: 'MRV', district: 'Quetta', address: 'MRV support point, Quetta', timing: 'Operational Hours', source: 'Internal update', mapX: 49, mapY: 60 }
];

const DEFAULT_USERS = [
  { id: 'usr-admin', name: 'Regional IT Administrator', username: 'admin@nadra.pk', password: 'Admin@123', role: 'Admin', status: 'Active' },
  { id: 'usr-engineer', name: 'Regional Network Engineer', username: 'engineer@nadra.pk', password: 'Pass@123', role: 'Network Engineer', status: 'Active' },
  { id: 'usr-tech', name: 'Regional Network Technician', username: 'technician@nadra.pk', password: 'Tech@123', role: 'Network Technician', status: 'Active' }
];

const sampleState = {
  siteDirectory: defaultSiteDirectory,
  complaints: [
    { id: 'cmp-001', dauName: 'NRC Pishin', district: 'Pishin', inchargeName: 'Muhammad Bilal', inchargeContact: '0301-4456789', complaintId: 'NADRA-NET-2026-1001', telecomTicket: 'PTCL-7784321', linkRole: 'Primary', provider: 'PTCL DSL', issueNature: 'Link Down', validatedCause: 'Primary link down', disruptionStart: '2026-07-17T09:10', resolutionTime: '2026-07-17T12:35', status: 'Resolved', userImpact: 'High', remarks: 'NMS showed PTCL primary unreachable. Secondary 4G backup was stable. PTCL representative was informed by phone and formal email, with HQ kept in CC.' },
    { id: 'cmp-002', dauName: 'NRC Chaman', district: 'Chaman', inchargeName: 'Abdul Qadir', inchargeContact: '0333-1098765', complaintId: 'NADRA-NET-2026-1002', telecomTicket: 'WAT-229921', linkRole: 'Primary', provider: 'Wateen Telecom', issueNature: 'Frequent Flapping', validatedCause: 'Provider outage', disruptionStart: '2026-07-18T11:00', resolutionTime: '', status: 'In Progress', userImpact: 'Critical', remarks: 'Intermittent flapping observed on NMS. DAU service degrading repeatedly. Escalated to Wateen NOC for priority action.' },
    { id: 'cmp-003', dauName: 'NRC Zhob', district: 'Zhob', inchargeName: 'Sajid Ali', inchargeContact: '0302-7772314', complaintId: 'NADRA-NET-2026-1003', telecomTicket: 'VSAT-44112', linkRole: 'Secondary', provider: 'VSAT DVBRCS', issueNature: 'Low Bandwidth on DVBrcs', validatedCause: 'Low bandwidth on DVBrcs', disruptionStart: '2026-07-16T15:20', resolutionTime: '2026-07-16T18:00', status: 'Closed', userImpact: 'Medium', remarks: 'VSAT backup suffered bandwidth degradation due to upstream congestion. Restoration was confirmed before complaint closure.' },
    { id: 'cmp-004', dauName: 'NRC Noshki', district: 'Noshki', inchargeName: 'Aamir Shah', inchargeContact: '0307-2241100', complaintId: 'NADRA-NET-2026-1004', telecomTicket: '', linkRole: 'Both', provider: '3G/4G SIM', issueNature: 'Cable Disconnected from Firewall / LAN Switch', validatedCause: 'Cable disconnected from firewall / LAN switch', disruptionStart: '2026-07-15T10:45', resolutionTime: '2026-07-15T11:15', status: 'Not Connectivity', userImpact: 'Low', remarks: 'WAN links were reachable in NMS. The site reported a disconnected uplink cable between the firewall and LAN switch.' },
    { id: 'cmp-005', dauName: 'NRC Loralai Morning Shift', district: 'Loralai', inchargeName: 'Imran Khan', inchargeContact: '0314-1289900', complaintId: 'NADRA-NET-2026-1005', telecomTicket: 'DRS-90318', linkRole: 'Primary', provider: 'DRS', issueNature: 'No Authentication / PPP Down', validatedCause: 'Provider outage', disruptionStart: '2026-07-14T08:05', resolutionTime: '2026-07-14T13:40', status: 'Resolved', userImpact: 'High', remarks: 'PPP session failed on the DRS primary link. Vendor confirmed a backend issue after escalation.' },
    { id: 'cmp-006', dauName: 'NRC Sibi', district: 'Sibi', inchargeName: 'Farooq Ahmed', inchargeContact: '0300-6001100', complaintId: 'NADRA-NET-2026-1006', telecomTicket: '', linkRole: 'Primary', provider: 'PTCL DSL', issueNature: 'Power Issue / Fluctuating Electricity', validatedCause: 'Power issue', disruptionStart: '2026-07-12T14:00', resolutionTime: '2026-07-12T16:25', status: 'Not Connectivity', userImpact: 'Medium', remarks: 'Router and modem shutdown was linked to unstable electrical power and UPS depletion at site.' },
    { id: 'cmp-007', dauName: 'NRC RHO Quetta (Quetta-III) Morning Shift', district: 'Quetta', inchargeName: 'Nazia Baloch', inchargeContact: '0335-7770041', complaintId: 'NADRA-NET-2026-0997', telecomTicket: 'PTCL-7741102', linkRole: 'Primary', provider: 'PTCL DSL', issueNature: 'CPE / Router Fault', validatedCause: 'Router / CPE issue', disruptionStart: '2026-06-28T12:10', resolutionTime: '2026-06-28T17:55', status: 'Closed', userImpact: 'High', remarks: 'PTCL modem stopped syncing. Device was replaced after repeated LOS alarms and closure was recorded after service verification.' },
    { id: 'cmp-008', dauName: 'Verification Section RHO Quetta', district: 'Quetta', inchargeName: 'Section Supervisor', inchargeContact: 'Ext-208', complaintId: 'NADRA-NET-2026-1009', telecomTicket: '', linkRole: 'Primary', provider: 'PTCL DSL', issueNature: 'ClearPass OnGuard Issue', validatedCause: 'ClearPass OnGuard issue', disruptionStart: '2026-07-18T10:05', resolutionTime: '2026-07-18T11:20', status: 'Not Connectivity', userImpact: 'Medium', remarks: 'Endpoint onboarding was failing due to ClearPass OnGuard agent issue rather than WAN failure.' },
    { id: 'cmp-009', dauName: 'NRC Khuzdar', district: 'Khuzdar', inchargeName: 'Shabbir Bizenjo', inchargeContact: '0308-2345678', complaintId: 'NADRA-NET-2026-1007', telecomTicket: 'PTCL-7800001', linkRole: 'Both', provider: 'PTCL DSL', issueNature: 'Link Down', validatedCause: 'Both links down', disruptionStart: '2026-07-19T09:20', resolutionTime: '', status: 'Open', userImpact: 'Critical', remarks: 'Branch operations are affected. Primary PTCL is down and backup SIM is also not passing traffic. Immediate escalation is required.' },
    { id: 'cmp-010', dauName: 'Project Site Taftan', district: 'Chaghi', inchargeName: 'Project Focal Person', inchargeContact: '0331-0001122', complaintId: 'NADRA-NET-2026-1010', telecomTicket: '', linkRole: 'Primary', provider: 'VSAT DVBRCS', issueNature: 'DVBrcs IDU / ODU Faulty', validatedCause: 'DVBrcs IDU / ODU issue', disruptionStart: '2026-07-18T13:25', resolutionTime: '', status: 'Open', userImpact: 'High', remarks: 'Project site reported loss of VSAT service and faulty IDU/ODU behavior requiring vendor intervention.' }
  ],
  adRequests: [
    { id: 'ad-001', employeeName: 'Ayesha Bibi', employeeRef: 'EMP-2187', oldDau: 'Mega Center Morning Shift', newDau: 'NRC Zhob', requestType: 'OU Transfer', hrOrder: 'HQ-HR-Postings-2026-117', requestedBy: 'Regional HR Officer', status: 'Resolved', requestDate: '2026-07-11', completedDate: '2026-07-11', notes: 'User moved to Zhob OU after HR posting order verification.' },
    { id: 'ad-002', employeeName: 'Ghulam Rasool', employeeRef: 'EMP-1455', oldDau: 'NRC Pishin', newDau: 'NRC Pishin', requestType: 'Account Unlock', hrOrder: 'N/A', requestedBy: 'DAU Incharge', status: 'Resolved', requestDate: '2026-07-14', completedDate: '2026-07-14', notes: 'Account unlocked after identity verification.' },
    { id: 'ad-003', employeeName: 'Abida Noor', employeeRef: 'EMP-3310', oldDau: 'NRC Chaman', newDau: 'NRC Chaman', requestType: 'Password Reset', hrOrder: 'N/A', requestedBy: 'DAU Incharge', status: 'Open', requestDate: '2026-07-19', completedDate: '', notes: 'User forgot password during morning shift.' },
    { id: 'ad-004', employeeName: 'Waqar Ahmed', employeeRef: 'EMP-4088', oldDau: 'NRC Sibi', newDau: 'NRC Loralai Morning Shift', requestType: 'OU Transfer', hrOrder: 'HQ-HR-Postings-2026-121', requestedBy: 'Regional HR Officer', status: 'In Progress', requestDate: '2026-07-18', completedDate: '', notes: 'Awaiting destination OU verification.' },
    { id: 'ad-005', employeeName: 'Sanaullah Kasi', employeeRef: 'EMP-1944', oldDau: 'NRC RHO Quetta (Quetta-III) Morning Shift', newDau: 'NRC RHO Quetta (Quetta-III) Morning Shift', requestType: 'Password Reset', hrOrder: 'N/A', requestedBy: 'Section Officer', status: 'Resolved', requestDate: '2026-07-09', completedDate: '2026-07-09', notes: 'Temporary password issued and forced password change on next logon.' },
    { id: 'ad-006', employeeName: 'Mehwish Baloch', employeeRef: 'EMP-2870', oldDau: 'NRC Noshki', newDau: 'NRC Noshki', requestType: 'Account Unlock', hrOrder: 'N/A', requestedBy: 'DAU Incharge', status: 'Resolved', requestDate: '2026-07-16', completedDate: '2026-07-16', notes: 'User account unlocked after failed login attempts.' },
    { id: 'ad-007', employeeName: 'Abida Noor', employeeRef: 'EMP-3310', oldDau: 'NRC Chaman', newDau: 'NRC Chaman', requestType: 'Password Reset', hrOrder: 'N/A', requestedBy: 'DAU Incharge', status: 'Resolved', requestDate: '2026-07-05', completedDate: '2026-07-05', notes: 'Repeated password refresh request logged for reporting.' },
    { id: 'ad-008', employeeName: 'Ghulam Rasool', employeeRef: 'EMP-1455', oldDau: 'NRC Pishin', newDau: 'NRC Pishin', requestType: 'Account Unlock', hrOrder: 'N/A', requestedBy: 'DAU Incharge', status: 'Resolved', requestDate: '2026-07-03', completedDate: '2026-07-03', notes: 'Repeated unlock request recorded for analysis.' }
  ],
  inventoryRecords: [
    { id: 'inv-001', siteName: 'NRC Pishin', siteType: 'DAU', make: 'Dell', model: 'OptiPlex 7090', serialNo: 'DL-PIS-7090', deviceIp: '10.10.1.5', lanIp: '192.168.10.1', firewallModel: 'FortiGate 60F', firewallSerial: 'FGT-PIS-001', firewallIp: '10.10.1.1', firewallBandwidth: '100 Mbps', switchModel: 'Cisco Catalyst 2960', switchSerial: 'SW-PIS-001', switchIp: '10.10.1.2', switchBandwidth: '1 Gbps', primaryMedia: 'PTCL DSL', primaryBandwidth: '10 Mbps', primaryMediaIp: '172.16.1.2', secondaryMedia: '3G/4G SIM', secondaryBandwidth: '4 Mbps', secondaryMediaIp: '10.20.1.2', dvbrcsIp: '', remarks: 'Standard DAU inventory baseline.' },
    { id: 'inv-002', siteName: 'Verification Section RHO Quetta', siteType: 'Section', make: 'HP', model: 'ProDesk 600 G6', serialNo: 'HP-VS-600', deviceIp: '10.11.1.5', lanIp: '192.168.20.1', firewallModel: 'FortiGate 80F', firewallSerial: 'FGT-QTA-080', firewallIp: '10.11.1.1', firewallBandwidth: '200 Mbps', switchModel: 'Cisco Catalyst 9200', switchSerial: 'SW-QTA-9200', switchIp: '10.11.1.2', switchBandwidth: '1 Gbps', primaryMedia: 'PTCL DSL', primaryBandwidth: '20 Mbps', primaryMediaIp: '172.16.11.2', secondaryMedia: '3G/4G SIM', secondaryBandwidth: '10 Mbps', secondaryMediaIp: '10.21.11.2', dvbrcsIp: '', remarks: 'Verification section inventory for quick on-spot reference.' },
    { id: 'inv-003', siteName: 'Project Site Taftan', siteType: 'Project Site', make: 'Lenovo', model: 'ThinkCentre M720', serialNo: 'PRJ-TAF-720', deviceIp: '10.30.1.5', lanIp: '192.168.30.1', firewallModel: 'MikroTik RB4011', firewallSerial: 'MT-TAF-4011', firewallIp: '10.30.1.1', firewallBandwidth: '50 Mbps', switchModel: 'TP-Link TL-SG2428', switchSerial: 'SW-TAF-2428', switchIp: '10.30.1.2', switchBandwidth: '1 Gbps', primaryMedia: 'VSAT DVBRCS', primaryBandwidth: '4 Mbps', primaryMediaIp: '172.30.1.2', secondaryMedia: '3G/4G SIM', secondaryBandwidth: '2 Mbps', secondaryMediaIp: '10.31.1.2', dvbrcsIp: '172.30.1.10', remarks: 'Project site inventory includes DVBrcs addressing.' }
  ],
  techTasks: [
    { id: 'tsk-001', locationName: 'Verification Section RHO Quetta', sectionName: 'Verification Section', origin: 'Verification Section', taskType: 'Installation', asset: 'Desktop System', priority: 'High', status: 'Resolved', requestDate: '2026-07-10', completedDate: '2026-07-10', requestedBy: 'Section Incharge', remarks: 'Installed a new desktop system at the verification desk and configured required applications.' },
    { id: 'tsk-002', locationName: 'NRC RHO Quetta (Quetta-III) Morning Shift', sectionName: 'RHO Quetta Section', origin: 'RHO Quetta Section', taskType: 'Upgradation', asset: 'RAM Upgrade for Enrollment System', priority: 'Medium', status: 'Closed', requestDate: '2026-07-08', completedDate: '2026-07-08', requestedBy: 'Operations Officer', remarks: 'System memory upgraded and performance verified.' },
    { id: 'tsk-003', locationName: 'Project Site Taftan', sectionName: 'Project Team', origin: 'Project Site', taskType: 'Replacement', asset: 'Faulty Network Switch', priority: 'High', status: 'In Progress', requestDate: '2026-07-18', completedDate: '', requestedBy: 'Project Focal Person', remarks: 'Replacement switch arranged; field completion pending.' },
    { id: 'tsk-004', locationName: 'MRV Quetta Support Point', sectionName: 'MRV Support', origin: 'MRV', taskType: 'Fault Repair', asset: 'Printer Unit', priority: 'Medium', status: 'Open', requestDate: '2026-07-19', completedDate: '', requestedBy: 'MRV Team', remarks: 'Printer not responding during operational use.' },
    { id: 'tsk-005', locationName: 'NRC Pishin', sectionName: 'Field Support', origin: 'DAU', taskType: 'Preventive Maintenance', asset: 'Enrollment Workstation', priority: 'Low', status: 'Resolved', requestDate: '2026-07-14', completedDate: '2026-07-14', requestedBy: 'DAU Incharge', remarks: 'Routine preventive maintenance completed and system health verified.' }
  ]
};

let state = loadState();
let users = loadUsers();
let currentSession = loadSession();
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
const validTabIds = Array.from(panels).map(panel => panel.id);
state.siteDirectory = normalizeSiteDirectory(state.siteDirectory);
sampleState.siteDirectory = normalizeSiteDirectory(sampleState.siteDirectory);

function el(id) { return document.getElementById(id); }
function copy(value) { return JSON.parse(JSON.stringify(value)); }
function generateId(prefix) { return `${prefix}-${Math.random().toString(36).slice(2, 10)}`; }
function defaultDateLocal() { return new Date().toISOString().slice(0, 10); }
function defaultDateTimeLocal() { const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); return now.toISOString().slice(0, 16); }
function monthKey(value) { return value ? value.slice(0, 7) : ''; }
function isValidTabId(tabId) { return validTabIds.includes(tabId); }
function getInitialTab() { const hashTab = location.hash.replace('#', '').trim(); if (isValidTabId(hashTab)) return hashTab; const saved = localStorage.getItem(ACTIVE_TAB_KEY); return isValidTabId(saved) ? saved : 'dashboard'; }
function escapeHtml(value) { return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function formatDate(value) { if (!value) return '—'; const d = new Date(value); return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: '2-digit' }); }
function formatDateTime(value) { if (!value) return '—'; const d = new Date(value); return Number.isNaN(d.getTime()) ? value : d.toLocaleString('en-PK', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); }
function getDurationHours(start, end) { if (!start || !end) return null; const a = new Date(start).getTime(); const b = new Date(end).getTime(); return Number.isNaN(a) || Number.isNaN(b) || b < a ? null : (b - a) / (1000 * 60 * 60); }
function formatHours(hours) { if (hours == null) return '—'; return hours < 1 ? `${Math.round(hours * 60)}m` : `${hours.toFixed(1)}h`; }
function badgeClass(status) { return ({ 'Open': 'open', 'In Progress': 'in-progress', 'Resolved': 'resolved', 'Closed': 'closed', 'Not Connectivity': 'not-connectivity' }[status]) || 'open'; }
function isConnectivityCause(cause) { return ['Primary link down', 'Secondary link down', 'Both links down', 'Provider outage', 'Router / CPE issue', 'DVBrcs IDU / ODU issue', 'Low bandwidth on DVBrcs'].includes(cause); }
function isGenuineConnectivity(record) { return isConnectivityCause(record.validatedCause); }
function roleAccessLabel(role) { return (ROLE_PERMISSIONS[role] || []).map(tab => ({ dashboard: 'Dashboard', complaints: 'Complaint Desk', reports: 'Reports', map: 'Map', directory: 'Directory', inventory: 'Inventory', 'technical-tasks': 'Technical Tasks', 'ad-support': 'AD Support', users: 'User Management', 'ai-assistant': 'AI Assistant', documentation: 'Project Notes' }[tab])).join(', '); }
function isAdmin() { return currentSession?.role === 'Admin'; }
function activePermissions() { return currentSession ? (ROLE_PERMISSIONS[currentSession.role] || ['dashboard']) : []; }
function canManageInventory() { return ['Admin', 'Network Engineer'].includes(currentSession?.role); }
function getDefaultMediaProfile(type = 'DAU') {
  if (type === 'Section') return { primaryMedia: 'PTCL DSL', primaryBandwidth: '20 Mbps', secondaryMedia: '3G/4G SIM', secondaryBandwidth: '10 Mbps' };
  if (type === 'Project Site') return { primaryMedia: 'VSAT DVBRCS', primaryBandwidth: '4 Mbps', secondaryMedia: '3G/4G SIM', secondaryBandwidth: '2 Mbps' };
  if (type === 'MRV') return { primaryMedia: '3G/4G SIM', primaryBandwidth: '10 Mbps', secondaryMedia: 'None', secondaryBandwidth: '' };
  return { primaryMedia: 'PTCL DSL', primaryBandwidth: '10 Mbps', secondaryMedia: '3G/4G SIM', secondaryBandwidth: '4 Mbps' };
}
function normalizeSiteDirectory(records) {
  return (records || []).map(site => {
    const defaults = getDefaultMediaProfile(site.type || 'DAU');
    const override = SITE_POSITION_OVERRIDES[site.dauName] || {};
    const mapX = Math.min(88, Math.max(12, Number(override.mapX ?? site.mapX ?? 50)));
    const mapY = Math.min(88, Math.max(12, Number(override.mapY ?? site.mapY ?? 50)));
    return {
      ...site,
      type: site.type || 'DAU',
      primaryMedia: site.primaryMedia || defaults.primaryMedia,
      primaryBandwidth: site.primaryBandwidth || defaults.primaryBandwidth,
      secondaryMedia: site.secondaryMedia == null ? defaults.secondaryMedia : site.secondaryMedia,
      secondaryBandwidth: site.secondaryBandwidth == null ? defaults.secondaryBandwidth : site.secondaryBandwidth,
      mapX,
      mapY
    };
  });
}
function getSiteByName(name) {
  return state.siteDirectory.find(site => site.dauName.toLowerCase() === String(name || '').trim().toLowerCase()) || null;
}
function siteMediaLine(site) {
  if (!site) return 'Site media profile not configured.';
  const primary = site.primaryMedia && site.primaryMedia !== 'None' ? `${site.primaryMedia}${site.primaryBandwidth ? ` (${site.primaryBandwidth})` : ''}` : 'Not configured';
  const secondary = site.secondaryMedia && site.secondaryMedia !== 'None' ? `${site.secondaryMedia}${site.secondaryBandwidth ? ` (${site.secondaryBandwidth})` : ''}` : 'Not configured';
  return `Primary: ${primary} | Secondary: ${secondary}`;
}
function getProviderOptionsForSite(site, linkRole = 'Primary') {
  if (!site) return MEDIA_OPTIONS.map(media => ({ value: media, label: media }));
  const options = [];
  const pushMedia = (role, media, bandwidth) => {
    if (!media || media === 'None') return;
    const label = `${media} (${role}${bandwidth ? ` - ${bandwidth}` : ''})`;
    options.push({ value: media, label });
  };
  if (linkRole === 'Primary') pushMedia('Primary', site.primaryMedia, site.primaryBandwidth);
  else if (linkRole === 'Secondary') pushMedia('Secondary', site.secondaryMedia, site.secondaryBandwidth);
  else {
    pushMedia('Primary', site.primaryMedia, site.primaryBandwidth);
    pushMedia('Secondary', site.secondaryMedia, site.secondaryBandwidth);
  }
  const dedup = [];
  const seen = new Set();
  options.forEach(opt => {
    const key = `${opt.value}|${opt.label}`;
    if (!seen.has(key)) { seen.add(key); dedup.push(opt); }
  });
  return dedup.length ? dedup : MEDIA_OPTIONS.map(media => ({ value: media, label: media }));
}
function refreshComplaintProviderOptions(site = null, preferredValue = '') {
  const currentSite = site || getSiteByName(el('dauName').value) || (el('siteTemplate').value !== '' ? state.siteDirectory[Number(el('siteTemplate').value)] : null);
  const options = getProviderOptionsForSite(currentSite, el('linkRole').value);
  const select = el('provider');
  select.innerHTML = options.map(opt => `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`).join('');
  const desired = preferredValue || select.value;
  if (options.some(opt => opt.value === desired)) select.value = desired;
}
function getComplaintSiteSnapshot(site) {
  if (!site) return { sitePrimaryMedia: '', sitePrimaryBandwidth: '', siteSecondaryMedia: '', siteSecondaryBandwidth: '' };
  return {
    sitePrimaryMedia: site.primaryMedia || '',
    sitePrimaryBandwidth: site.primaryBandwidth || '',
    siteSecondaryMedia: site.secondaryMedia || '',
    siteSecondaryBandwidth: site.secondaryBandwidth || ''
  };
}
function getComplaintMediaSummary(record) {
  const primary = record.sitePrimaryMedia || getSiteByName(record.dauName)?.primaryMedia || '';
  const primaryBw = record.sitePrimaryBandwidth || getSiteByName(record.dauName)?.primaryBandwidth || '';
  const secondary = record.siteSecondaryMedia || getSiteByName(record.dauName)?.secondaryMedia || '';
  const secondaryBw = record.siteSecondaryBandwidth || getSiteByName(record.dauName)?.secondaryBandwidth || '';
  const p = primary && primary !== 'None' ? `${primary}${primaryBw ? ` (${primaryBw})` : ''}` : 'Not configured';
  const s = secondary && secondary !== 'None' ? `${secondary}${secondaryBw ? ` (${secondaryBw})` : ''}` : 'Not configured';
  return `P: ${p} | S: ${s}`;
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleState));
    const seeded = copy(sampleState);
    seeded.siteDirectory = normalizeSiteDirectory(seeded.siteDirectory);
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw);
    parsed.siteDirectory = normalizeSiteDirectory(parsed.siteDirectory && parsed.siteDirectory.length ? parsed.siteDirectory : copy(defaultSiteDirectory));
    parsed.complaints ||= [];
    parsed.adRequests ||= [];
    parsed.inventoryRecords ||= [];
    parsed.techTasks ||= [];
    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleState));
    const seeded = copy(sampleState);
    seeded.siteDirectory = normalizeSiteDirectory(seeded.siteDirectory);
    return seeded;
  }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) { localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS)); return copy(DEFAULT_USERS); }
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed) && parsed.length ? parsed : copy(DEFAULT_USERS); } catch { localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS)); return copy(DEFAULT_USERS); }
}
function saveUsers() { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function loadSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } }
function saveSession(session) { currentSession = session; localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
function clearSession() { currentSession = null; localStorage.removeItem(SESSION_KEY); }

function showLogin() { el('loginScreen').classList.remove('hidden'); el('appShell').classList.add('hidden'); }
function showApp(name = 'Regional User') {
  el('loginScreen').classList.add('hidden');
  el('appShell').classList.remove('hidden');
  el('currentUserLabel').textContent = `Signed in as ${name}${currentSession?.role ? ` (${currentSession.role})` : ''}`;
  applyRoleVisibility();
  activateTab(getInitialTab(), { updateHash: false, persist: false });
}

function syncSessionWithUsers() {
  if (!currentSession) return;
  const user = users.find(item => item.id === currentSession.id || item.username === currentSession.username);
  if (!user || user.status !== 'Active') {
    clearSession();
    showLogin();
    return;
  }
  saveSession({ id: user.id, username: user.username, name: user.name, role: user.role });
}

function initAuth() {
  if (!currentSession) return showLogin();
  const user = users.find(item => item.username === currentSession.username && item.status === 'Active');
  if (!user) { clearSession(); return showLogin(); }
  saveSession({ id: user.id, username: user.username, name: user.name, role: user.role });
  showApp(user.name);
}

function applyRoleVisibility() {
  const permissions = activePermissions();
  tabs.forEach(tab => tab.classList.toggle('hidden', !permissions.includes(tab.dataset.tab)));
  document.querySelectorAll('[data-go-tab]').forEach(button => button.classList.toggle('hidden', !permissions.includes(button.dataset.goTab)));
  el('userAdminNotice').classList.toggle('hidden', isAdmin());
  el('userAdminContent').classList.toggle('hidden', !isAdmin());
  el('directoryAdminNotice').classList.toggle('hidden', isAdmin());
  el('directoryAdminContent').classList.toggle('hidden', !isAdmin());
  el('inventoryManageNotice').classList.toggle('hidden', canManageInventory());
  el('inventoryManageContent').classList.toggle('hidden', !canManageInventory());
  const activeTab = localStorage.getItem(ACTIVE_TAB_KEY) || 'dashboard';
  if (permissions.length && !permissions.includes(activeTab)) activateTab('dashboard');
}

function activateTab(tabId, options = {}) {
  const permissions = activePermissions();
  if (!isValidTabId(tabId) || (permissions.length && !permissions.includes(tabId))) tabId = permissions[0] || 'dashboard';
  const { updateHash = true, persist = true } = options;
  tabs.forEach(btn => {
    const active = btn.dataset.tab === tabId;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });
  panels.forEach(panel => panel.classList.toggle('active', panel.id === tabId));
  if (persist) localStorage.setItem(ACTIVE_TAB_KEY, tabId);
  if (updateHash && location.hash !== `#${tabId}`) history.replaceState(null, '', `#${tabId}`);
}

function scrollToPanel(panelId) {
  const node = el(panelId);
  if (node) window.scrollTo({ top: node.offsetTop - 84, behavior: 'smooth' });
}

function getStatusCounts(records) {
  return {
    Open: records.filter(r => r.status === 'Open').length,
    'In Progress': records.filter(r => r.status === 'In Progress').length,
    Resolved: records.filter(r => r.status === 'Resolved').length,
    Closed: records.filter(r => r.status === 'Closed').length,
    'Not Connectivity': records.filter(r => r.status === 'Not Connectivity').length
  };
}

function renderBarList(containerId, entries, emptyMessage = 'No data available.') {
  const container = el(containerId);
  const rows = entries.filter(([, value]) => value > 0);
  if (!rows.length) return container.innerHTML = `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
  const max = Math.max(...rows.map(([, value]) => value), 1);
  container.innerHTML = `<div class="chart-list">${rows.map(([label, value]) => `
    <div class="chart-row">
      <div>${escapeHtml(label)}</div>
      <div class="chart-track"><div class="chart-fill" style="width:${(value / max) * 100}%"></div></div>
      <strong>${value}</strong>
    </div>
  `).join('')}</div>`;
}

function renderLegendCards(containerId, entries, emptyMessage = 'No data available.') {
  const container = el(containerId);
  const rows = entries.filter(([, value]) => value > 0);
  if (!rows.length) return container.innerHTML = `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
  container.innerHTML = `<div class="legend-grid">${rows.map(([label, value]) => `<div class="legend-card"><strong>${value}</strong><span>${escapeHtml(label)}</span></div>`).join('')}</div>`;
}

function renderMiniColumns(containerId, entries, emptyMessage = 'No data available.') {
  const container = el(containerId);
  const positive = entries.filter(([, value]) => value > 0);
  if (!positive.length) return container.innerHTML = `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
  const max = Math.max(...positive.map(([, value]) => value), 1);
  container.innerHTML = `<div class="mini-columns">${entries.map(([label, value]) => {
    const height = value <= 0 ? 18 : Math.max(28, Math.round((value / max) * 170));
    return `<div class="mini-col-wrap"><div class="mini-col" style="height:${height}px">${value}</div><div class="mini-col-label">${escapeHtml(label)}</div></div>`;
  }).join('')}</div>`;
}

function getLastSixMonths() {
  const result = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleDateString('en-PK', { month: 'short' }) });
  }
  return result;
}

function updateMiniStats() {
  const activeComplaints = state.complaints.filter(item => ['Open', 'In Progress', 'Resolved'].includes(item.status)).length;
  el('miniComplaints').textContent = state.complaints.length;
  el('miniOpen').textContent = activeComplaints;
  el('miniSites').textContent = state.siteDirectory.length;
  el('miniUsers').textContent = users.filter(item => item.status === 'Active').length;
  el('loginStatSites').textContent = state.siteDirectory.length;
}

function renderRoleSummary() {
  const counts = users.reduce((acc, user) => {
    const key = `${user.role} (${user.status})`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const rows = Object.entries(counts);
  el('userRoleSummary').innerHTML = rows.length ? `<div class="role-pills">${rows.map(([label, value]) => `<div class="role-pill"><strong>${value}</strong><span>${escapeHtml(label)}</span></div>`).join('')}</div>` : '<div class="empty-state">No users available.</div>';
}

function renderCriticalAlerts() {
  const critical = state.complaints.filter(item => ['Open', 'In Progress'].includes(item.status) && (item.userImpact === 'Critical' || item.linkRole === 'Both' || item.validatedCause === 'Both links down'));
  if (!critical.length) return el('criticalAlerts').innerHTML = '<div class="alert-card success"><strong>No critical alerts at present.</strong><span>There are no open high-severity complaints requiring urgent escalation.</span></div>';
  el('criticalAlerts').innerHTML = critical.map(item => `<div class="alert-card"><strong>${escapeHtml(item.complaintId)} — ${escapeHtml(item.dauName)}</strong><span>${escapeHtml(item.provider)} | ${escapeHtml(item.issueNature)} | ${escapeHtml(item.status)} | Impact: ${escapeHtml(item.userImpact)}</span></div>`).join('');
}

function buildComplaintsTable(records, withActions = true) {
  if (!records.length) return '<div class="empty-state">No complaints found.</div>';
  return `
    <table>
      <thead>
        <tr>
          <th>Complaint ID</th>
          <th>Site / District</th>
          <th>Incharge</th>
          <th>Provider</th>
          <th>Issue</th>
          <th>Disruption Start</th>
          <th>Resolution</th>
          <th>Status</th>
          <th>Downtime</th>
          ${withActions ? '<th>Actions</th>' : ''}
        </tr>
      </thead>
      <tbody>
        ${records.map(record => `
          <tr>
            <td><strong>${escapeHtml(record.complaintId)}</strong><br><span class="hint">Telco: ${escapeHtml(record.telecomTicket || 'Not launched')}</span></td>
            <td><strong>${escapeHtml(record.dauName)}</strong><br><span class="hint">${escapeHtml(record.district || '—')} · ${escapeHtml(record.linkRole || 'Primary')}</span></td>
            <td>${escapeHtml(record.inchargeName)}<br><span class="hint">${escapeHtml(record.inchargeContact || 'No contact')}</span></td>
            <td>${escapeHtml(record.provider)}<br><span class="hint">${escapeHtml(getComplaintMediaSummary(record))}</span></td>
            <td>${escapeHtml(record.issueNature)}<br><span class="hint">${escapeHtml(record.validatedCause)}</span></td>
            <td>${escapeHtml(formatDateTime(record.disruptionStart))}</td>
            <td>${escapeHtml(formatDateTime(record.resolutionTime))}</td>
            <td><span class="badge ${badgeClass(record.status)}">${escapeHtml(record.status)}</span></td>
            <td>${escapeHtml(formatHours(getDurationHours(record.disruptionStart, record.resolutionTime)))}</td>
            ${withActions ? `<td><div class="row-actions"><button type="button" class="tiny action-edit" data-id="${record.id}">Edit</button><button type="button" class="tiny action-ai" data-id="${record.id}">AI Draft</button>${record.status === 'Resolved' || record.status === 'Not Connectivity' ? `<button type="button" class="tiny action-close" data-id="${record.id}">Close</button>` : record.status === 'Closed' ? `<span class="hint">Closed</span>` : `<button type="button" class="tiny secondary" disabled>Resolve first</button>`}<button type="button" class="tiny danger action-delete" data-id="${record.id}">Delete</button></div></td>` : ''}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderDashboard() {
  const counts = getStatusCounts(state.complaints);
  el('kpiTotal').textContent = state.complaints.length;
  el('kpiOpen').textContent = counts.Open;
  el('kpiProgress').textContent = counts['In Progress'];
  el('kpiResolved').textContent = counts.Resolved;
  el('kpiClosed').textContent = counts.Closed;
  el('kpiNonConnectivity').textContent = counts['Not Connectivity'];

  renderLegendCards('statusChart', Object.entries(counts), 'No status data available.');
  const providerCounts = state.complaints.reduce((acc, item) => { acc[item.provider] = (acc[item.provider] || 0) + 1; return acc; }, {});
  renderBarList('providerBars', Object.entries(providerCounts).sort((a, b) => b[1] - a[1]), 'No provider data available.');
  renderMiniColumns('monthlyTrendChart', getLastSixMonths().map(month => [month.label, state.complaints.filter(item => monthKey(item.disruptionStart) === month.key).length]), 'No monthly trend available.');
  const siteCounts = state.complaints.reduce((acc, item) => { acc[item.dauName] = (acc[item.dauName] || 0) + 1; return acc; }, {});
  const topSites = Object.entries(siteCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  el('topDauList').innerHTML = topSites.length ? topSites.map(([name, count]) => `<div class="list-item"><div><strong>${escapeHtml(name)}</strong><div class="hint">Recurring complaint location</div></div><strong>${count}</strong></div>`).join('') : '<div class="empty-state">No site data available.</div>';
  el('recentComplaints').innerHTML = buildComplaintsTable([...state.complaints].sort((a, b) => new Date(b.disruptionStart) - new Date(a.disruptionStart)).slice(0, 5), false);
  el('recentAdRequests').innerHTML = buildAdTable([...state.adRequests].sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)).slice(0, 5), false);
  renderRoleSummary();
  renderCriticalAlerts();
}

function renderSiteOptions() {
  el('siteTemplate').innerHTML = '<option value="">Select a Quetta-region site</option>' + state.siteDirectory.map((site, index) => `<option value="${index}">${escapeHtml(site.dauName)} — ${escapeHtml(site.type)} / ${escapeHtml(site.district)}</option>`).join('');
  el('dauSuggestions').innerHTML = state.siteDirectory.map(site => `<option value="${escapeHtml(site.dauName)}"></option>`).join('');
  el('taskSiteTemplate').innerHTML = '<option value="">Select configured site</option>' + state.siteDirectory.map((site, index) => `<option value="${index}">${escapeHtml(site.dauName)} — ${escapeHtml(site.type)}</option>`).join('');
  el('inventorySiteTemplate').innerHTML = '<option value="">Select configured site</option>' + state.siteDirectory.map((site, index) => `<option value="${index}">${escapeHtml(site.dauName)} — ${escapeHtml(site.type)}</option>`).join('');
  const types = [...new Set(state.siteDirectory.map(site => site.type))].sort();
  el('directoryTypeFilter').innerHTML = '<option value="All">All Site Types</option>' + types.map(type => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('');
  el('mapTypeFilter').innerHTML = '<option value="All">All Site Types</option>' + types.map(type => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('');
}

function getFilteredDirectory() {
  const search = el('directorySearch').value.trim().toLowerCase();
  const type = el('directoryTypeFilter').value;
  return state.siteDirectory.filter(site => {
    const hay = [site.dauName, site.type, site.district, site.address, site.timing, site.source].join(' ').toLowerCase();
    return (!search || hay.includes(search)) && (type === 'All' || site.type === type);
  }).sort((a, b) => a.dauName.localeCompare(b.dauName));
}

function renderDirectoryTable() {
  const records = getFilteredDirectory();
  if (!records.length) return el('directoryTable').innerHTML = '<div class="empty-state">No site directory records found.</div>';
  el('directoryTable').innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Site / Office</th>
          <th>Type</th>
          <th>District</th>
          <th>Address</th>
          <th>Primary Media</th>
          <th>Secondary Media</th>
          <th>Timing</th>
          <th>Source</th>
          ${isAdmin() ? '<th>Actions</th>' : ''}
        </tr>
      </thead>
      <tbody>
        ${records.map(site => `
          <tr>
            <td><strong>${escapeHtml(site.dauName)}</strong></td>
            <td>${escapeHtml(site.type)}</td>
            <td>${escapeHtml(site.district)}</td>
            <td>${escapeHtml(site.address)}</td>
            <td>${escapeHtml(site.primaryMedia || 'None')}<br><span class="hint">${escapeHtml(site.primaryBandwidth || '—')}</span></td>
            <td>${escapeHtml(site.secondaryMedia || 'None')}<br><span class="hint">${escapeHtml(site.secondaryBandwidth || '—')}</span></td>
            <td>${escapeHtml(site.timing)}</td>
            <td>${escapeHtml(site.source || '—')}</td>
            ${isAdmin() ? `<td><div class="row-actions"><button type="button" class="tiny action-directory-edit" data-id="${site.id}">Edit</button><button type="button" class="tiny danger action-directory-delete" data-id="${site.id}">Delete</button></div></td>` : ''}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function getFilteredInventory() {
  const search = el('inventorySearch').value.trim().toLowerCase();
  return state.inventoryRecords.filter(record => {
    const hay = [record.siteName, record.siteType, record.make, record.model, record.serialNo, record.deviceIp, record.lanIp, record.firewallModel, record.firewallSerial, record.firewallIp, record.switchModel, record.switchSerial, record.switchIp, record.primaryMedia, record.primaryBandwidth, record.primaryMediaIp, record.secondaryMedia, record.secondaryBandwidth, record.secondaryMediaIp, record.dvbrcsIp].join(' ').toLowerCase();
    return !search || hay.includes(search);
  }).sort((a, b) => a.siteName.localeCompare(b.siteName));
}

function buildInventoryTable(records, withActions = true) {
  if (!records.length) return '<div class="empty-state">No inventory records found.</div>';
  return `
    <table>
      <thead>
        <tr>
          <th>Site</th>
          <th>Device</th>
          <th>Firewall</th>
          <th>Switch</th>
          <th>LAN / Device IP</th>
          <th>Primary Media</th>
          <th>Secondary Media</th>
          <th>DVBrcs IP</th>
          ${withActions ? '<th>Actions</th>' : ''}
        </tr>
      </thead>
      <tbody>
        ${records.map(record => `
          <tr>
            <td><strong>${escapeHtml(record.siteName)}</strong><br><span class="hint">${escapeHtml(record.siteType || '—')}</span></td>
            <td>${escapeHtml(record.make || '—')} / ${escapeHtml(record.model || '—')}<br><span class="hint">S/N: ${escapeHtml(record.serialNo || '—')}</span></td>
            <td>${escapeHtml(record.firewallModel || '—')}<br><span class="hint">S/N: ${escapeHtml(record.firewallSerial || '—')} | IP: ${escapeHtml(record.firewallIp || '—')} | BW: ${escapeHtml(record.firewallBandwidth || '—')}</span></td>
            <td>${escapeHtml(record.switchModel || '—')}<br><span class="hint">S/N: ${escapeHtml(record.switchSerial || '—')} | IP: ${escapeHtml(record.switchIp || '—')} | BW: ${escapeHtml(record.switchBandwidth || '—')}</span></td>
            <td>LAN: ${escapeHtml(record.lanIp || '—')}<br><span class="hint">Device: ${escapeHtml(record.deviceIp || '—')}</span></td>
            <td>${escapeHtml(record.primaryMedia || '—')}<br><span class="hint">${escapeHtml(record.primaryBandwidth || '—')} | IP: ${escapeHtml(record.primaryMediaIp || '—')}</span></td>
            <td>${escapeHtml(record.secondaryMedia || '—')}<br><span class="hint">${escapeHtml(record.secondaryBandwidth || '—')} | IP: ${escapeHtml(record.secondaryMediaIp || '—')}</span></td>
            <td>${escapeHtml(record.dvbrcsIp || '—')}</td>
            ${withActions ? `<td>${canManageInventory() ? `<div class="row-actions"><button type="button" class="tiny action-inventory-edit" data-id="${record.id}">Edit</button><button type="button" class="tiny danger action-inventory-delete" data-id="${record.id}">Delete</button></div>` : '<span class="hint">View only</span>'}</td>` : ''}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function buildInventoryReportTable(records) {
  if (!records.length) return '<div class="empty-state">No inventory snapshot available.</div>';
  return `
    <table>
      <thead>
        <tr>
          <th>Site</th>
          <th>LAN IP</th>
          <th>Primary Media</th>
          <th>Secondary Media</th>
          <th>Firewall IP</th>
          <th>Switch IP</th>
          <th>DVBrcs IP</th>
        </tr>
      </thead>
      <tbody>
        ${records.map(record => `
          <tr>
            <td>${escapeHtml(record.siteName)}</td>
            <td>${escapeHtml(record.lanIp || '—')}</td>
            <td>${escapeHtml(record.primaryMedia || '—')}<br><span class="hint">${escapeHtml(record.primaryBandwidth || '—')}</span></td>
            <td>${escapeHtml(record.secondaryMedia || '—')}<br><span class="hint">${escapeHtml(record.secondaryBandwidth || '—')}</span></td>
            <td>${escapeHtml(record.firewallIp || '—')}</td>
            <td>${escapeHtml(record.switchIp || '—')}</td>
            <td>${escapeHtml(record.dvbrcsIp || '—')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderInventorySummary() {
  const total = state.inventoryRecords.length;
  const firewallCount = state.inventoryRecords.filter(item => item.firewallModel || item.firewallIp).length;
  const switchCount = state.inventoryRecords.filter(item => item.switchModel || item.switchIp).length;
  const dvbrcsCount = state.inventoryRecords.filter(item => item.dvbrcsIp).length;
  el('inventoryTotal').textContent = total;
  el('inventoryFirewallCount').textContent = firewallCount;
  el('inventorySwitchCount').textContent = switchCount;
  el('inventoryDvbrcsCount').textContent = dvbrcsCount;
  const primaryMediaCounts = state.inventoryRecords.reduce((acc, item) => { const key = item.primaryMedia || 'Not Configured'; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
  el('reportsInventorySummary').innerHTML = `<strong>Total Inventory Records:</strong> ${total}<br><strong>Sites with Firewall Information:</strong> ${firewallCount}<br><strong>Sites with Switch Information:</strong> ${switchCount}<br><strong>DVBrcs IP Recorded:</strong> ${dvbrcsCount}`;
  renderBarList('reportsInventoryChart', Object.entries(primaryMediaCounts).sort((a,b)=>b[1]-a[1]), 'No inventory media distribution available.');
  el('reportsInventoryTable').innerHTML = buildInventoryReportTable(state.inventoryRecords);
}

function renderInventoryTable() {
  el('inventoryTable').innerHTML = buildInventoryTable(getFilteredInventory(), true);
}

function resetInventoryForm() {
  el('inventoryForm').reset();
  el('inventoryRecordId').value = '';
  el('inventorySiteTemplate').value = '';
  el('inventorySiteType').value = '';
}

function applyInventorySiteTemplate() {
  const index = el('inventorySiteTemplate').value;
  if (index === '') return;
  const site = state.siteDirectory[Number(index)];
  if (!site) return;
  el('inventorySiteName').value = site.dauName;
  el('inventorySiteType').value = site.type;
  el('inventoryPrimaryMedia').value = site.primaryMedia || '';
  el('inventoryPrimaryBandwidth').value = site.primaryBandwidth || '';
  el('inventorySecondaryMedia').value = site.secondaryMedia || '';
  el('inventorySecondaryBandwidth').value = site.secondaryBandwidth || '';
}

function handleInventorySubmit(event) {
  event.preventDefault();
  if (!canManageInventory()) return alert('Only administrators and Network Engineers can modify inventory records.');
  const id = el('inventoryRecordId').value || generateId('inv');
  const site = getSiteByName(el('inventorySiteName').value);
  const record = {
    id,
    siteName: el('inventorySiteName').value.trim(),
    siteType: el('inventorySiteType').value.trim() || site?.type || '',
    make: el('inventoryMake').value.trim(),
    model: el('inventoryModel').value.trim(),
    serialNo: el('inventorySerialNo').value.trim(),
    deviceIp: el('inventoryDeviceIp').value.trim(),
    lanIp: el('inventoryLanIp').value.trim(),
    firewallModel: el('inventoryFirewallModel').value.trim(),
    firewallSerial: el('inventoryFirewallSerial').value.trim(),
    firewallIp: el('inventoryFirewallIp').value.trim(),
    firewallBandwidth: el('inventoryFirewallBandwidth').value.trim(),
    switchModel: el('inventorySwitchModel').value.trim(),
    switchSerial: el('inventorySwitchSerial').value.trim(),
    switchIp: el('inventorySwitchIp').value.trim(),
    switchBandwidth: el('inventorySwitchBandwidth').value.trim(),
    primaryMedia: el('inventoryPrimaryMedia').value.trim() || site?.primaryMedia || '',
    primaryBandwidth: el('inventoryPrimaryBandwidth').value.trim() || site?.primaryBandwidth || '',
    primaryMediaIp: el('inventoryPrimaryMediaIp').value.trim(),
    secondaryMedia: el('inventorySecondaryMedia').value.trim() || site?.secondaryMedia || '',
    secondaryBandwidth: el('inventorySecondaryBandwidth').value.trim() || site?.secondaryBandwidth || '',
    secondaryMediaIp: el('inventorySecondaryMediaIp').value.trim(),
    dvbrcsIp: el('inventoryDvbrcsIp').value.trim(),
    remarks: el('inventoryRemarks').value.trim()
  };
  if (!record.siteName) return alert('Please select or enter the site name for inventory.');
  const idx = state.inventoryRecords.findIndex(item => item.id === id);
  if (idx >= 0) state.inventoryRecords[idx] = record; else state.inventoryRecords.push(record);
  saveState();
  renderAll();
  resetInventoryForm();
  alert('Inventory record saved successfully.');
}

function editInventory(id) {
  const record = state.inventoryRecords.find(item => item.id === id);
  if (!record) return;
  el('inventoryRecordId').value = record.id;
  const siteIndex = state.siteDirectory.findIndex(site => site.dauName === record.siteName);
  el('inventorySiteTemplate').value = siteIndex >= 0 ? String(siteIndex) : '';
  el('inventorySiteName').value = record.siteName;
  el('inventorySiteType').value = record.siteType || '';
  el('inventoryMake').value = record.make || '';
  el('inventoryModel').value = record.model || '';
  el('inventorySerialNo').value = record.serialNo || '';
  el('inventoryDeviceIp').value = record.deviceIp || '';
  el('inventoryLanIp').value = record.lanIp || '';
  el('inventoryFirewallModel').value = record.firewallModel || '';
  el('inventoryFirewallSerial').value = record.firewallSerial || '';
  el('inventoryFirewallIp').value = record.firewallIp || '';
  el('inventoryFirewallBandwidth').value = record.firewallBandwidth || '';
  el('inventorySwitchModel').value = record.switchModel || '';
  el('inventorySwitchSerial').value = record.switchSerial || '';
  el('inventorySwitchIp').value = record.switchIp || '';
  el('inventorySwitchBandwidth').value = record.switchBandwidth || '';
  el('inventoryPrimaryMedia').value = record.primaryMedia || '';
  el('inventoryPrimaryBandwidth').value = record.primaryBandwidth || '';
  el('inventoryPrimaryMediaIp').value = record.primaryMediaIp || '';
  el('inventorySecondaryMedia').value = record.secondaryMedia || '';
  el('inventorySecondaryBandwidth').value = record.secondaryBandwidth || '';
  el('inventorySecondaryMediaIp').value = record.secondaryMediaIp || '';
  el('inventoryDvbrcsIp').value = record.dvbrcsIp || '';
  el('inventoryRemarks').value = record.remarks || '';
  activateTab('inventory');
  scrollToPanel('inventory');
}

function deleteInventory(id) {
  if (!canManageInventory()) return;
  if (!confirm('Delete this inventory record?')) return;
  state.inventoryRecords = state.inventoryRecords.filter(item => item.id !== id);
  saveState();
  renderAll();
}

function markerClass(site) {
  const siteComplaints = state.complaints.filter(item => item.dauName === site.dauName);
  const critical = siteComplaints.some(item => ['Open', 'In Progress'].includes(item.status) && (item.userImpact === 'Critical' || item.linkRole === 'Both' || item.validatedCause === 'Both links down'));
  const active = siteComplaints.some(item => ['Open', 'In Progress', 'Resolved'].includes(item.status));
  if (critical) return 'critical';
  if (active) return 'active';
  return 'normal';
}

function complaintCountForSite(siteName) {
  return state.complaints.filter(item => item.dauName === siteName).length;
}

function openComplaintCountForSite(siteName) {
  return state.complaints.filter(item => item.dauName === siteName && ['Open', 'In Progress', 'Resolved'].includes(item.status)).length;
}

function renderMapSiteDetail(siteId) {
  if (!siteId) {
    el('mapSiteDetail').innerHTML = 'Select a marker on the map to view site details and complaint summary.';
    return;
  }
  const site = state.siteDirectory.find(item => item.id === siteId);
  if (!site) {
    el('mapSiteDetail').innerHTML = 'Select a marker on the map to view site details and complaint summary.';
    return;
  }
  const siteComplaints = state.complaints.filter(item => item.dauName === site.dauName).sort((a, b) => new Date(b.disruptionStart) - new Date(a.disruptionStart));
  const recent = siteComplaints.slice(0, 3);
  el('mapSiteDetail').innerHTML = `
    <strong>${escapeHtml(site.dauName)}</strong><br>
    <span class="hint">Type: ${escapeHtml(site.type)} | District: ${escapeHtml(site.district)}</span><br>
    <span class="hint">Address: ${escapeHtml(site.address)}</span><br>
    <span class="hint">${escapeHtml(siteMediaLine(site))}</span><br>
    <span class="hint">Configured complaints: ${siteComplaints.length} | Active: ${openComplaintCountForSite(site.dauName)}</span>
    ${recent.length ? `<hr><strong>Recent Complaints</strong><ul>${recent.map(item => `<li>${escapeHtml(item.complaintId)} — ${escapeHtml(item.issueNature)} (${escapeHtml(item.status)})</li>`).join('')}</ul>` : '<hr><span class="hint">No complaints recorded for this site yet.</span>'}
  `;
}

function renderBalochistanMap() {
  const typeFilter = el('mapTypeFilter').value || 'All';
  const sites = state.siteDirectory.filter(site => typeFilter === 'All' || site.type === typeFilter);
  const mainPath = `M 421.6 626.5 L 418.4 633.6 L 423.6 635.8 L 413.9 638.5 L 416.7 633.0 L 412.8 629.3 L 398.0 631.6 L 371.1 623.9 L 373.5 620.9 L 369.4 617.8 L 376.2 617.7 L 375.2 614.5 L 378.7 613.8 L 373.6 610.8 L 363.0 612.2 L 359.6 617.1 L 366.8 616.6 L 367.9 623.8 L 326.4 620.2 L 315.7 626.2 L 319.6 634.2 L 236.2 628.8 L 220.2 636.9 L 218.6 641.8 L 222.6 643.9 L 212.6 643.0 L 217.7 641.6 L 216.8 636.9 L 204.2 633.0 L 195.5 636.6 L 198.4 643.3 L 181.1 642.9 L 171.1 650.8 L 166.4 649.3 L 171.3 637.3 L 168.1 640.3 L 161.0 635.5 L 167.2 629.9 L 161.4 637.2 L 153.7 636.5 L 161.2 623.2 L 163.3 582.9 L 171.2 581.2 L 177.1 545.8 L 200.7 538.1 L 201.7 531.8 L 214.7 534.5 L 212.4 526.9 L 216.7 520.1 L 227.8 516.3 L 257.6 509.1 L 291.4 509.5 L 293.4 492.5 L 301.1 489.8 L 298.9 471.8 L 304.2 467.0 L 292.7 458.1 L 272.6 462.4 L 258.0 458.7 L 264.2 438.7 L 256.7 389.7 L 258.7 368.5 L 241.5 370.4 L 228.3 357.3 L 194.0 348.5 L 173.3 337.1 L 139.7 294.2 L 136.0 275.8 L 95.0 233.5 L 231.9 273.4 L 334.3 264.7 L 375.3 274.7 L 379.6 266.0 L 405.4 256.5 L 454.4 259.7 L 517.8 245.4 L 559.3 233.1 L 567.2 223.1 L 556.9 213.7 L 562.5 206.7 L 569.2 181.8 L 561.8 172.9 L 569.6 153.9 L 567.3 151.4 L 578.0 139.9 L 575.8 138.5 L 587.6 136.3 L 596.6 127.6 L 599.5 114.6 L 623.9 106.0 L 624.0 112.7 L 628.1 115.3 L 649.2 117.2 L 688.8 104.6 L 689.5 98.3 L 677.6 98.3 L 670.7 87.2 L 685.9 89.3 L 697.3 80.3 L 713.9 74.4 L 723.9 60.8 L 734.1 67.5 L 755.8 71.2 L 759.7 68.0 L 746.8 66.9 L 758.6 61.3 L 770.0 66.3 L 778.9 80.2 L 787.2 80.9 L 806.0 72.1 L 819.8 54.1 L 843.9 50.2 L 861.1 40.1 L 873.2 40.7 L 865.5 42.5 L 863.6 47.4 L 870.9 50.1 L 869.6 57.8 L 875.6 56.4 L 871.5 87.7 L 878.6 91.2 L 882.4 106.3 L 885.4 98.1 L 900.1 92.0 L 898.6 122.9 L 903.3 128.9 L 901.7 142.1 L 905.0 144.5 L 888.4 157.4 L 889.2 164.6 L 880.6 182.1 L 882.4 188.1 L 875.4 193.7 L 886.5 196.0 L 877.2 197.7 L 886.1 198.4 L 879.4 212.8 L 865.5 236.0 L 844.1 249.6 L 841.5 268.6 L 850.1 271.1 L 851.5 282.3 L 859.2 279.0 L 856.6 291.0 L 835.0 312.5 L 833.3 317.7 L 837.9 321.7 L 828.0 339.4 L 818.5 343.2 L 826.0 352.9 L 749.6 354.5 L 741.1 365.2 L 726.4 370.7 L 702.7 391.5 L 660.6 400.9 L 654.8 414.7 L 648.0 419.2 L 635.3 453.0 L 639.0 470.9 L 636.2 504.3 L 640.1 521.2 L 661.4 555.8 L 662.8 579.3 L 637.5 611.5 L 620.7 645.6 L 600.5 654.1 L 595.7 660.0 L 600.9 635.9 L 583.8 620.6 L 586.9 614.7 L 583.2 607.8 L 574.2 607.8 L 565.9 600.3 L 557.5 604.5 L 581.6 609.5 L 580.7 617.2 L 560.9 611.5 L 521.3 615.7 L 505.2 621.4 L 473.1 619.2 L 466.4 625.8 L 421.6 626.5 Z`;
  const outline = `
    <svg class="map-svg-shell" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="mapGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#eef8f0"></stop>
          <stop offset="100%" stop-color="#dff1e3"></stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="700" fill="#f8fcf8"></rect>
      <path d="${mainPath}" fill="url(#mapGrad)" stroke="#0f7b35" stroke-width="8" stroke-linejoin="round"></path>
      <path d="${mainPath}" fill="none" stroke="#b9d9c0" stroke-width="2" stroke-linejoin="round"></path>
      <text x="500" y="48" text-anchor="middle" fill="#0f7b35" font-size="30" font-weight="700">Balochistan Site Visibility Map</text>
      <text x="500" y="675" text-anchor="middle" fill="#64748b" font-size="18">Improved province outline based on public Balochistan boundary reference and regional site placement</text>
    </svg>`;
  const markers = sites.map(site => {
    const total = complaintCountForSite(site.dauName);
    const open = openComplaintCountForSite(site.dauName);
    const label = `${site.dauName} | Total complaints: ${total} | Active: ${open}`;
    return `<button type="button" class="map-marker ${markerClass(site)}" style="left:${site.mapX || 50}%; top:${site.mapY || 50}%;" data-site-id="${site.id}" title="${escapeHtml(label)}"><span>${total}</span></button>`;
  }).join('');
  el('balochistanMap').innerHTML = `${outline}<div class="map-markers">${markers}</div>`;
  document.querySelectorAll('.map-marker').forEach(btn => btn.addEventListener('click', () => renderMapSiteDetail(btn.dataset.siteId)));
}

function setSelectedSiteInfo(site) {
  if (!site) return el('selectedSiteInfo').textContent = 'Select a site template to display site details from the directory.';
  el('selectedSiteInfo').innerHTML = `<strong>${escapeHtml(site.dauName)}</strong><br>${escapeHtml(site.address)}<br><span class="hint">Type: ${escapeHtml(site.type)} | District: ${escapeHtml(site.district)} | Timing: ${escapeHtml(site.timing)}</span><br><span class="hint">${escapeHtml(siteMediaLine(site))}</span>`;
}

function applySiteTemplate() {
  const index = el('siteTemplate').value;
  if (index === '') return setSelectedSiteInfo(null);
  const site = state.siteDirectory[Number(index)];
  if (!site) return;
  el('dauName').value = site.dauName;
  el('district').value = site.district;
  setSelectedSiteInfo(site);
  refreshComplaintProviderOptions(site);
}

function syncTypedSite() {
  const value = el('dauName').value.trim().toLowerCase();
  const site = state.siteDirectory.find(item => item.dauName.toLowerCase() === value);
  if (!site) return;
  el('district').value = site.district;
  const index = state.siteDirectory.findIndex(item => item.dauName.toLowerCase() === value);
  if (index >= 0) el('siteTemplate').value = String(index);
  setSelectedSiteInfo(site);
  refreshComplaintProviderOptions(site);
}

function autoSetValidatedCause() {
  const issue = el('issueNature').value;
  const linkRole = el('linkRole').value;
  let cause = 'Provider outage';
  if (issue === 'Link Down') cause = linkRole === 'Primary' ? 'Primary link down' : linkRole === 'Secondary' ? 'Secondary link down' : 'Both links down';
  else if (issue === 'High Latency' || issue === 'Frequent Flapping' || issue === 'No Authentication / PPP Down') cause = 'Provider outage';
  else if (issue === 'CPE / Router Fault') cause = 'Router / CPE issue';
  else if (issue === 'Firewall Fault') cause = 'Firewall issue';
  else if (issue === 'Switch Fault') cause = 'Switch issue';
  else if (issue === 'Faulty Device / Hardware') cause = 'Hardware faulty';
  else if (issue === 'DVBrcs IDU / ODU Faulty') cause = 'DVBrcs IDU / ODU issue';
  else if (issue === 'Low Bandwidth on DVBrcs') cause = 'Low bandwidth on DVBrcs';
  else if (issue === 'LAN Issue') cause = 'LAN / switch issue';
  else if (issue === 'Cable Disconnected from Firewall / LAN Switch') cause = 'Cable disconnected from firewall / LAN switch';
  else if (issue === 'ClearPass OnGuard Issue') cause = 'ClearPass OnGuard issue';
  else if (issue === 'Power Issue / Fluctuating Electricity') cause = 'Power issue';
  else if (issue === 'Generator Faulty') cause = 'Generator faulty';
  else if (issue === 'OneApp / HQ Portal Down') cause = 'HQ application / portal down';
  else if (issue === 'False Alarm') cause = 'False alarm';
  el('validatedCause').value = cause;
  if (!isConnectivityCause(cause) && el('status').value === 'Open') el('status').value = 'Not Connectivity';
}

function populateProviderFilter() {
  const providers = [...new Set(state.complaints.map(item => item.provider))].sort();
  const current = el('complaintProviderFilter').value || 'All';
  el('complaintProviderFilter').innerHTML = '<option value="All">All Providers</option>' + providers.map(provider => `<option value="${escapeHtml(provider)}">${escapeHtml(provider)}</option>`).join('');
  el('complaintProviderFilter').value = providers.includes(current) || current === 'All' ? current : 'All';
}

function getFilteredComplaints() {
  const search = el('complaintSearch').value.trim().toLowerCase();
  const status = el('complaintStatusFilter').value;
  const provider = el('complaintProviderFilter').value;
  return state.complaints.filter(record => {
    const hay = [record.dauName, record.district, record.inchargeName, record.provider, record.complaintId, record.telecomTicket, record.issueNature, record.validatedCause].join(' ').toLowerCase();
    return (!search || hay.includes(search)) && (status === 'All' || record.status === status) && (provider === 'All' || record.provider === provider);
  }).sort((a, b) => new Date(b.disruptionStart) - new Date(a.disruptionStart));
}

function renderComplaintsTable() { el('complaintsTable').innerHTML = buildComplaintsTable(getFilteredComplaints(), true); }

function generateComplaintRef() { return `NADRA-NET-2026-${1000 + state.complaints.length + 1}`; }
function resetComplaintForm() {
  el('complaintForm').reset();
  el('complaintRecordId').value = '';
  el('siteTemplate').value = '';
  el('linkRole').value = 'Primary';
  el('provider').value = 'PTCL DSL';
  el('status').value = 'Open';
  el('userImpact').value = 'Medium';
  el('disruptionStart').value = defaultDateTimeLocal();
  el('resolutionTime').value = '';
  setSelectedSiteInfo(null);
  autoSetValidatedCause();
  refreshComplaintProviderOptions(null, 'PTCL DSL');
}


function handleComplaintSubmit(event) {
  event.preventDefault();
  autoSetValidatedCause();
  const id = el('complaintRecordId').value || generateId('cmp');
  const selectedSite = getSiteByName(el('dauName').value) || (el('siteTemplate').value !== '' ? state.siteDirectory[Number(el('siteTemplate').value)] : null);
  const record = {
    id,
    dauName: el('dauName').value.trim(),
    district: el('district').value.trim(),
    inchargeName: el('inchargeName').value.trim(),
    inchargeContact: el('inchargeContact').value.trim(),
    complaintId: el('complaintId').value.trim() || generateComplaintRef(),
    telecomTicket: el('telecomTicket').value.trim(),
    linkRole: el('linkRole').value,
    provider: el('provider').value,
    issueNature: el('issueNature').value,
    validatedCause: el('validatedCause').value,
    disruptionStart: el('disruptionStart').value,
    resolutionTime: el('resolutionTime').value,
    status: el('status').value,
    userImpact: el('userImpact').value,
    remarks: el('complaintRemarks').value.trim(),
    ...getComplaintSiteSnapshot(selectedSite)
  };
  if (!record.dauName || !record.inchargeName || !record.provider || !record.issueNature || !record.disruptionStart) return alert('Please complete the required complaint fields first.');
  if (!record.district) {
    if (selectedSite) record.district = selectedSite.district;
  }
  if (['Resolved', 'Closed', 'Not Connectivity'].includes(record.status) && !record.resolutionTime) record.resolutionTime = defaultDateTimeLocal();
  const index = state.complaints.findIndex(item => item.id === id);
  if (index >= 0) state.complaints[index] = record; else state.complaints.push(record);
  saveState();
  renderAll();
  resetComplaintForm();
  alert('Complaint saved successfully.');
}

function editComplaint(id) {
  const record = state.complaints.find(item => item.id === id);
  if (!record) return;
  el('complaintRecordId').value = record.id;
  const index = state.siteDirectory.findIndex(site => site.dauName === record.dauName);
  el('siteTemplate').value = index >= 0 ? String(index) : '';
  const matchedSite = index >= 0 ? state.siteDirectory[index] : getSiteByName(record.dauName);
  setSelectedSiteInfo(matchedSite);
  el('dauName').value = record.dauName;
  el('district').value = record.district || '';
  el('inchargeName').value = record.inchargeName;
  el('inchargeContact').value = record.inchargeContact || '';
  el('complaintId').value = record.complaintId || '';
  el('telecomTicket').value = record.telecomTicket || '';
  el('linkRole').value = record.linkRole || 'Primary';
  refreshComplaintProviderOptions(matchedSite, record.provider || 'PTCL DSL');
  el('issueNature').value = record.issueNature || 'Link Down';
  el('validatedCause').value = record.validatedCause || 'Provider outage';
  el('disruptionStart').value = record.disruptionStart || defaultDateTimeLocal();
  el('resolutionTime').value = record.resolutionTime || '';
  el('status').value = record.status || 'Open';
  el('userImpact').value = record.userImpact || 'Medium';
  el('complaintRemarks').value = record.remarks || '';
  activateTab('complaints');
  scrollToPanel('complaints');
}

function closeComplaint(id) {
  const record = state.complaints.find(item => item.id === id);
  if (!record) return;
  if (!['Resolved', 'Not Connectivity'].includes(record.status)) return alert('Only resolved or non-connectivity complaints can be closed.');
  record.status = 'Closed';
  if (!record.resolutionTime) record.resolutionTime = defaultDateTimeLocal();
  saveState();
  renderAll();
}

function deleteComplaint(id) {
  if (!confirm('Delete this complaint record?')) return;
  state.complaints = state.complaints.filter(item => item.id !== id);
  saveState();
  renderAll();
}

function getFilteredAdRequests() {
  const search = el('adSearch').value.trim().toLowerCase();
  const type = el('adTypeFilter').value;
  return state.adRequests.filter(record => {
    const hay = [record.employeeName, record.employeeRef, record.oldDau, record.newDau, record.requestType, record.hrOrder, record.requestedBy].join(' ').toLowerCase();
    return (!search || hay.includes(search)) && (type === 'All' || record.requestType === type);
  }).sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
}

function buildAdTable(records, withActions = true) {
  if (!records.length) return '<div class="empty-state">No AD requests found.</div>';
  return `
    <table>
      <thead>
        <tr>
          <th>Employee</th>
          <th>Request Type</th>
          <th>Movement</th>
          <th>HR / Requester</th>
          <th>Dates</th>
          <th>Status</th>
          <th>Notes</th>
          ${withActions ? '<th>Actions</th>' : ''}
        </tr>
      </thead>
      <tbody>
        ${records.map(record => `
          <tr>
            <td><strong>${escapeHtml(record.employeeName)}</strong><br><span class="hint">${escapeHtml(record.employeeRef || 'No ref')}</span></td>
            <td>${escapeHtml(record.requestType)}</td>
            <td>${escapeHtml(record.oldDau || '—')}<br><span class="hint">to ${escapeHtml(record.newDau || '—')}</span></td>
            <td>${escapeHtml(record.hrOrder || 'N/A')}<br><span class="hint">${escapeHtml(record.requestedBy || '—')}</span></td>
            <td>${escapeHtml(formatDate(record.requestDate))}<br><span class="hint">Done: ${escapeHtml(formatDate(record.completedDate))}</span></td>
            <td><span class="badge ${badgeClass(record.status === 'Resolved' ? 'Resolved' : record.status === 'In Progress' ? 'In Progress' : 'Open')}">${escapeHtml(record.status)}</span></td>
            <td>${escapeHtml(record.notes || '—')}</td>
            ${withActions ? `<td><div class="row-actions"><button type="button" class="tiny action-ad-edit" data-id="${record.id}">Edit</button><button type="button" class="tiny danger action-ad-delete" data-id="${record.id}">Delete</button></div></td>` : ''}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderAdTable() { el('adTable').innerHTML = buildAdTable(getFilteredAdRequests(), true); }

function renderAdSummary() {
  const total = state.adRequests.length;
  const passwordResets = state.adRequests.filter(item => item.requestType === 'Password Reset').length;
  const unlocks = state.adRequests.filter(item => item.requestType === 'Account Unlock').length;
  const transfers = state.adRequests.filter(item => item.requestType === 'OU Transfer').length;
  el('adTotalRequests').textContent = total;
  el('adPasswordRequests').textContent = passwordResets;
  el('adUnlockRequests').textContent = unlocks;
  el('adTransferRequests').textContent = transfers;
  renderBarList('adTypeChart', [['Password Reset', passwordResets], ['Account Unlock', unlocks], ['OU Transfer', transfers]], 'No AD request data available.');

  const repeated = {};
  state.adRequests.filter(item => ['Password Reset', 'Account Unlock'].includes(item.requestType)).forEach(item => repeated[item.employeeName] = (repeated[item.employeeName] || 0) + 1);
  renderBarList('adEmployeeChart', Object.entries(repeated).sort((a, b) => b[1] - a[1]).slice(0, 6), 'No repeated reset/unlock activity found.');

  const passwordCounts = {};
  const unlockCounts = {};
  state.adRequests.filter(item => item.requestType === 'Password Reset').forEach(item => passwordCounts[item.employeeName] = (passwordCounts[item.employeeName] || 0) + 1);
  state.adRequests.filter(item => item.requestType === 'Account Unlock').forEach(item => unlockCounts[item.employeeName] = (unlockCounts[item.employeeName] || 0) + 1);
  const topPassword = Object.entries(passwordCounts).sort((a, b) => b[1] - a[1])[0];
  const topUnlock = Object.entries(unlockCounts).sort((a, b) => b[1] - a[1])[0];
  const alerts = [];
  if (topPassword) alerts.push({ type: topPassword[1] >= 2 ? 'warning' : 'info', title: 'Most repeated password reset employee', text: `${topPassword[0]} — ${topPassword[1]} request(s)` });
  if (topUnlock) alerts.push({ type: topUnlock[1] >= 2 ? 'warning' : 'info', title: 'Most repeated account unlock employee', text: `${topUnlock[0]} — ${topUnlock[1]} request(s)` });
  if (!alerts.length) alerts.push({ type: 'success', title: 'No repeated AD alerts', text: 'No recurring password reset or unlock pattern is visible in the current dataset.' });
  el('adAlerts').innerHTML = alerts.map(alert => `<div class="alert-card ${alert.type}"><strong>${escapeHtml(alert.title)}</strong><span>${escapeHtml(alert.text)}</span></div>`).join('');
  el('reportsAdSummary').innerHTML = `<strong>Total Requests:</strong> ${total}<br><strong>Password Resets:</strong> ${passwordResets}<br><strong>Account Unlocks:</strong> ${unlocks}<br><strong>OU Transfers:</strong> ${transfers}`;
  renderBarList('reportsAdChart', [['Password Reset', passwordResets], ['Account Unlock', unlocks], ['OU Transfer', transfers]], 'No AD request data available.');
}

function resetAdForm() { el('adForm').reset(); el('adRecordId').value = ''; el('requestDate').value = defaultDateLocal(); }
function handleAdSubmit(event) {
  event.preventDefault();
  const id = el('adRecordId').value || generateId('ad');
  const record = {
    id,
    employeeName: el('employeeName').value.trim(),
    employeeRef: el('employeeRef').value.trim(),
    oldDau: el('oldDau').value.trim(),
    newDau: el('newDau').value.trim(),
    requestType: el('requestType').value,
    hrOrder: el('hrOrder').value.trim(),
    requestedBy: el('requestedBy').value.trim(),
    status: el('adStatus').value,
    requestDate: el('requestDate').value,
    completedDate: el('completedDate').value,
    notes: el('adNotes').value.trim()
  };
  const index = state.adRequests.findIndex(item => item.id === id);
  if (index >= 0) state.adRequests[index] = record; else state.adRequests.push(record);
  saveState();
  renderAll();
  resetAdForm();
  alert('AD support request saved successfully.');
}

function editAdRequest(id) {
  const record = state.adRequests.find(item => item.id === id);
  if (!record) return;
  el('adRecordId').value = record.id;
  el('employeeName').value = record.employeeName;
  el('employeeRef').value = record.employeeRef || '';
  el('oldDau').value = record.oldDau || '';
  el('newDau').value = record.newDau || '';
  el('requestType').value = record.requestType;
  el('hrOrder').value = record.hrOrder || '';
  el('requestedBy').value = record.requestedBy || '';
  el('adStatus').value = record.status;
  el('requestDate').value = record.requestDate || defaultDateLocal();
  el('completedDate').value = record.completedDate || '';
  el('adNotes').value = record.notes || '';
  activateTab('ad-support');
  scrollToPanel('ad-support');
}

function deleteAdRequest(id) {
  if (!confirm('Delete this AD support request?')) return;
  state.adRequests = state.adRequests.filter(item => item.id !== id);
  saveState();
  renderAll();
}

function getFilteredTasks() {
  const search = el('taskSearch').value.trim().toLowerCase();
  const type = el('taskTypeFilter').value;
  return state.techTasks.filter(task => {
    const hay = [task.locationName, task.sectionName, task.origin, task.taskType, task.asset, task.requestedBy, task.status].join(' ').toLowerCase();
    return (!search || hay.includes(search)) && (type === 'All' || task.taskType === type);
  }).sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
}

function buildTasksTable(records, withActions = true) {
  if (!records.length) return '<div class="empty-state">No technical tasks found.</div>';
  return `
    <table>
      <thead>
        <tr>
          <th>Location</th>
          <th>Origin</th>
          <th>Task Type</th>
          <th>System / Equipment</th>
          <th>Dates</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Requested By</th>
          <th>Remarks</th>
          ${withActions ? '<th>Actions</th>' : ''}
        </tr>
      </thead>
      <tbody>
        ${records.map(task => `
          <tr>
            <td><strong>${escapeHtml(task.locationName)}</strong><br><span class="hint">${escapeHtml(task.sectionName || '—')}</span></td>
            <td>${escapeHtml(task.origin)}</td>
            <td>${escapeHtml(task.taskType)}</td>
            <td>${escapeHtml(task.asset)}</td>
            <td>${escapeHtml(formatDate(task.requestDate))}<br><span class="hint">Done: ${escapeHtml(formatDate(task.completedDate))}</span></td>
            <td>${escapeHtml(task.priority)}</td>
            <td><span class="badge ${badgeClass(task.status === 'Resolved' ? 'Resolved' : task.status === 'In Progress' ? 'In Progress' : task.status === 'Closed' ? 'Closed' : 'Open')}">${escapeHtml(task.status)}</span></td>
            <td>${escapeHtml(task.requestedBy || '—')}</td>
            <td>${escapeHtml(task.remarks || '—')}</td>
            ${withActions ? `<td><div class="row-actions"><button type="button" class="tiny action-task-edit" data-id="${task.id}">Edit</button><button type="button" class="tiny danger action-task-delete" data-id="${task.id}">Delete</button></div></td>` : ''}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderTasksTable() { el('taskTable').innerHTML = buildTasksTable(getFilteredTasks(), true); }

function renderTechnicalSummary() {
  const total = state.techTasks.length;
  const installations = state.techTasks.filter(item => item.taskType === 'Installation').length;
  const upgradations = state.techTasks.filter(item => item.taskType === 'Upgradation').length;
  const replacements = state.techTasks.filter(item => ['Replacement', 'Fault Repair'].includes(item.taskType)).length;
  const typeCounts = state.techTasks.reduce((acc, item) => { acc[item.taskType] = (acc[item.taskType] || 0) + 1; return acc; }, {});
  const originCounts = state.techTasks.reduce((acc, item) => { acc[item.origin] = (acc[item.origin] || 0) + 1; return acc; }, {});
  el('taskTotal').textContent = total;
  el('taskInstallations').textContent = installations;
  el('taskUpgradations').textContent = upgradations;
  el('taskReplacements').textContent = replacements;
  renderBarList('taskTypeChart', Object.entries(typeCounts).sort((a, b) => b[1] - a[1]), 'No technical task data available.');
  renderBarList('taskOriginChart', Object.entries(originCounts).sort((a, b) => b[1] - a[1]), 'No technical origin data available.');
  el('reportsTechSummary').innerHTML = `<strong>Total Tasks:</strong> ${total}<br><strong>Installations:</strong> ${installations}<br><strong>Upgradations:</strong> ${upgradations}<br><strong>Replacements / Fault Repair:</strong> ${replacements}`;
  renderBarList('reportsTechChart', Object.entries(typeCounts).sort((a, b) => b[1] - a[1]), 'No technical task data available.');
}

function resetTaskForm() {
  el('taskForm').reset();
  el('taskRecordId').value = '';
  el('taskRequestDate').value = defaultDateLocal();
  el('taskStatus').value = 'Open';
  el('taskPriority').value = 'Medium';
  el('taskSiteTemplate').value = '';
}

function applyTaskSiteTemplate() {
  const index = el('taskSiteTemplate').value;
  if (index === '') return;
  const site = state.siteDirectory[Number(index)];
  if (!site) return;
  el('taskLocationName').value = site.dauName;
  el('taskSectionName').value = site.type === 'Section' ? site.dauName : site.district;
  if (site.type === 'Project Site') el('taskOrigin').value = 'Project Site';
  else if (site.type === 'MRV') el('taskOrigin').value = 'MRV';
  else if (site.type === 'Section') el('taskOrigin').value = 'RHO Quetta Section';
  else el('taskOrigin').value = 'DAU';
}

function handleTaskSubmit(event) {
  event.preventDefault();
  const id = el('taskRecordId').value || generateId('tsk');
  const record = {
    id,
    locationName: el('taskLocationName').value.trim(),
    sectionName: el('taskSectionName').value.trim(),
    origin: el('taskOrigin').value,
    taskType: el('taskType').value,
    asset: el('taskAsset').value.trim(),
    priority: el('taskPriority').value,
    status: el('taskStatus').value,
    requestDate: el('taskRequestDate').value,
    completedDate: el('taskCompletedDate').value,
    requestedBy: el('taskRequestedBy').value.trim(),
    remarks: el('taskRemarks').value.trim()
  };
  if (!record.locationName || !record.asset || !record.requestDate) return alert('Please complete the required technical task fields.');
  if (['Resolved', 'Closed'].includes(record.status) && !record.completedDate) record.completedDate = defaultDateLocal();
  const index = state.techTasks.findIndex(item => item.id === id);
  if (index >= 0) state.techTasks[index] = record; else state.techTasks.push(record);
  saveState();
  renderAll();
  resetTaskForm();
  alert('Technical task saved successfully.');
}

function editTask(id) {
  const task = state.techTasks.find(item => item.id === id);
  if (!task) return;
  el('taskRecordId').value = task.id;
  el('taskLocationName').value = task.locationName;
  el('taskSectionName').value = task.sectionName || '';
  el('taskOrigin').value = task.origin;
  el('taskType').value = task.taskType;
  el('taskAsset').value = task.asset;
  el('taskPriority').value = task.priority;
  el('taskStatus').value = task.status;
  el('taskRequestDate').value = task.requestDate || defaultDateLocal();
  el('taskCompletedDate').value = task.completedDate || '';
  el('taskRequestedBy').value = task.requestedBy || '';
  el('taskRemarks').value = task.remarks || '';
  const index = state.siteDirectory.findIndex(site => site.dauName === task.locationName);
  el('taskSiteTemplate').value = index >= 0 ? String(index) : '';
  activateTab('technical-tasks');
  scrollToPanel('technical-tasks');
}

function deleteTask(id) {
  if (!confirm('Delete this technical task?')) return;
  state.techTasks = state.techTasks.filter(item => item.id !== id);
  saveState();
  renderAll();
}

function resetDirectoryForm() {
  el('directoryForm').reset();
  el('directoryRecordId').value = '';
  el('directoryType').value = 'DAU';
  el('directorySource').value = 'Public NADRA office listing';
  el('directoryPrimaryMedia').value = 'PTCL DSL';
  el('directoryPrimaryBandwidth').value = '10 Mbps';
  el('directorySecondaryMedia').value = '3G/4G SIM';
  el('directorySecondaryBandwidth').value = '4 Mbps';
}


function handleDirectorySubmit(event) {
  event.preventDefault();
  if (!isAdmin()) return alert('Only administrators can modify the site directory.');
  const id = el('directoryRecordId').value || generateId('dir');
  const record = {
    id,
    dauName: el('directorySiteName').value.trim(),
    type: el('directoryType').value,
    district: el('directoryDistrict').value.trim(),
    address: el('directoryAddress').value.trim(),
    timing: el('directoryTiming').value.trim(),
    source: el('directorySource').value.trim() || 'Internal update',
    primaryMedia: el('directoryPrimaryMedia').value,
    primaryBandwidth: el('directoryPrimaryBandwidth').value.trim(),
    secondaryMedia: el('directorySecondaryMedia').value,
    secondaryBandwidth: el('directorySecondaryBandwidth').value.trim(),
    mapX: Number(el('directoryMapX').value || 50),
    mapY: Number(el('directoryMapY').value || 50)
  };
  if (!record.dauName || !record.district || !record.address || !record.timing) return alert('Please complete the required site directory fields.');
  const index = state.siteDirectory.findIndex(item => item.id === id);
  if (index >= 0) state.siteDirectory[index] = record; else state.siteDirectory.push(record);
  saveState();
  renderAll();
  resetDirectoryForm();
  alert('Site directory entry saved successfully.');
}

function editDirectory(id) {
  const site = state.siteDirectory.find(item => item.id === id);
  if (!site) return;
  el('directoryRecordId').value = site.id;
  el('directorySiteName').value = site.dauName;
  el('directoryType').value = site.type;
  el('directoryDistrict').value = site.district;
  el('directoryAddress').value = site.address;
  el('directoryTiming').value = site.timing;
  el('directorySource').value = site.source || '';
  el('directoryPrimaryMedia').value = site.primaryMedia || 'PTCL DSL';
  el('directoryPrimaryBandwidth').value = site.primaryBandwidth || '';
  el('directorySecondaryMedia').value = site.secondaryMedia || '3G/4G SIM';
  el('directorySecondaryBandwidth').value = site.secondaryBandwidth || '';
  el('directoryMapX').value = site.mapX ?? 50;
  el('directoryMapY').value = site.mapY ?? 50;
  activateTab('directory');
  scrollToPanel('directory');
}

function deleteDirectory(id) {
  if (!isAdmin()) return;
  if (!confirm('Delete this site directory record?')) return;
  state.siteDirectory = state.siteDirectory.filter(item => item.id !== id);
  saveState();
  renderAll();
}

function getFilteredUsers() {
  const search = el('userSearch').value.trim().toLowerCase();
  return users.filter(user => {
    const hay = [user.name, user.username, user.role, user.status].join(' ').toLowerCase();
    return !search || hay.includes(search);
  }).sort((a, b) => a.name.localeCompare(b.name));
}

function buildUsersTable(records) {
  if (!records.length) return '<div class="empty-state">No users found.</div>';
  return `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Role</th>
          <th>Page Access</th>
          <th>Status</th>
          <th>Password</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${records.map(user => `
          <tr>
            <td><strong>${escapeHtml(user.name)}</strong></td>
            <td>${escapeHtml(user.username)}</td>
            <td>${escapeHtml(user.role)}</td>
            <td><span class="hint">${escapeHtml(roleAccessLabel(user.role))}</span></td>
            <td><span class="badge ${user.status === 'Active' ? 'resolved' : 'not-connectivity'}">${escapeHtml(user.status)}</span></td>
            <td><code>${escapeHtml(user.password)}</code></td>
            <td><div class="row-actions"><button type="button" class="tiny action-user-edit" data-id="${user.id}">Edit</button><button type="button" class="tiny action-user-toggle" data-id="${user.id}">${user.status === 'Active' ? 'Deactivate' : 'Activate'}</button></div></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderUsersTable() { el('usersTable').innerHTML = buildUsersTable(getFilteredUsers()); }
function resetUserForm() { el('userForm').reset(); el('userRecordId').value = ''; el('userRole').value = 'Network Engineer'; el('userStatus').value = 'Active'; }

function handleUserSubmit(event) {
  event.preventDefault();
  if (!isAdmin()) return alert('Only administrators can manage user accounts.');
  const id = el('userRecordId').value || generateId('usr');
  const username = el('userUsername').value.trim().toLowerCase();
  const duplicate = users.find(user => user.username.toLowerCase() === username && user.id !== id);
  if (duplicate) return alert('A user with this username already exists.');
  const record = { id, name: el('userFullName').value.trim(), username, password: el('userPassword').value.trim(), role: el('userRole').value, status: el('userStatus').value };
  if (!record.name || !record.username || !record.password) return alert('Please complete the required user fields.');
  const index = users.findIndex(user => user.id === id);
  if (index >= 0) users[index] = record; else users.push(record);
  saveUsers();
  syncSessionWithUsers();
  renderAll();
  resetUserForm();
  alert('User saved successfully.');
}

function editUser(id) {
  if (!isAdmin()) return;
  const user = users.find(item => item.id === id);
  if (!user) return;
  el('userRecordId').value = user.id;
  el('userFullName').value = user.name;
  el('userUsername').value = user.username;
  el('userRole').value = user.role;
  el('userStatus').value = user.status;
  el('userPassword').value = user.password;
  activateTab('users');
  scrollToPanel('users');
}

function toggleUser(id) {
  if (!isAdmin()) return;
  const user = users.find(item => item.id === id);
  if (!user) return;
  if (user.id === currentSession?.id && user.status === 'Active') return alert('You cannot deactivate the account you are currently using.');
  if (user.role === 'Admin' && user.status === 'Active') {
    const activeAdmins = users.filter(item => item.role === 'Admin' && item.status === 'Active').length;
    if (activeAdmins <= 1) return alert('At least one active admin must remain in the system.');
  }
  user.status = user.status === 'Active' ? 'Inactive' : 'Active';
  saveUsers();
  syncSessionWithUsers();
  renderAll();
}

function fallbackAiDraft(record, extraContext = '') {
  const classification = isGenuineConnectivity(record)
    ? 'Genuine connectivity issue — the available indicators suggest a WAN, provider, or network-edge related fault.'
    : 'Likely non-connectivity or local issue — the available indicators suggest a LAN, power, endpoint, or HQ application-side problem rather than a carrier outage.';
  const severity = record.userImpact === 'Critical' || record.linkRole === 'Both' ? 'Critical' : record.userImpact || 'Medium';
  return `Classification\n${classification}\n\nSeverity\n${severity}\n\nEscalation Email\nSubject: Urgent Network Complaint at ${record.dauName} — ${record.complaintId}\n\nDear ${record.provider} Support Team,\n\nIt is respectfully submitted that ${record.dauName}, ${record.district}, is currently facing a service disruption on the ${record.linkRole.toLowerCase()} link provided by your organization. The complaint has been reviewed through regional monitoring and requires urgent attention.\n\nComplaint ID: ${record.complaintId}\nTelecom Ticket: ${record.telecomTicket || 'Pending launch'}\nDisruption Start: ${formatDateTime(record.disruptionStart)}\nIssue Nature: ${record.issueNature}\nValidated Cause: ${record.validatedCause}\nBusiness Impact: ${record.userImpact}\n\nRegional observations: ${record.remarks || 'Issue is under active verification.'}\n${extraContext ? `Additional context: ${extraContext}\n` : ''}You are requested to investigate the matter on priority and share the estimated restoration time at the earliest. HQ is being kept in CC for visibility and record.\n\nRegards,\nNetwork Engineer\nNADRA RHO Quetta Region\n\nSite Update\nDear ${record.inchargeName}, your complaint ${record.complaintId} has been examined through NMS and has been formally escalated to ${record.provider}. HQ has also been informed. Further updates will be shared as soon as restoration ETA or provider feedback is received.\n\nNext Technical Steps\n1. Reconfirm NMS alarms and link reachability.\n2. Verify power, router/modem status, and LAN condition from the site.\n3. Launch or update telecom complaint ticket.\n4. Share the formal escalation with HQ in CC.\n5. Record restoration time, root cause, and closure remarks after service recovery.`;
}

async function runAiForSelectedComplaint(prefillId = null) {
  if (prefillId) el('aiComplaintSelect').value = prefillId;
  const record = state.complaints.find(item => item.id === el('aiComplaintSelect').value);
  if (!record) return;
  activateTab('ai-assistant');
  const extraContext = el('aiExtraContext').value.trim();
  el('aiOutput').textContent = 'Generating AI draft...';
  try {
    const response = await fetch('/api/ai-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complaint: record, extraContext, systemPrompt: AI_SYSTEM_PROMPT })
    });
    if (!response.ok) throw new Error('AI API request failed');
    const data = await response.json();
    el('aiOutput').textContent = data.output || fallbackAiDraft(record, extraContext);
  } catch {
    el('aiOutput').textContent = fallbackAiDraft(record, extraContext);
  }
}

function generateMonthlyReport() {
  if (!el('reportMonth').value) el('reportMonth').value = new Date().toISOString().slice(0, 7);
  const month = el('reportMonth').value;
  const records = state.complaints.filter(item => monthKey(item.disruptionStart) === month);
  const counts = getStatusCounts(records);
  const genuine = records.filter(isGenuineConnectivity).length;
  const nonConnectivity = records.filter(item => !isGenuineConnectivity(item)).length;
  const providerCounts = records.reduce((acc, item) => { acc[item.provider] = (acc[item.provider] || 0) + 1; return acc; }, {});
  const issueCounts = records.reduce((acc, item) => { acc[item.issueNature] = (acc[item.issueNature] || 0) + 1; return acc; }, {});
  const downtimeValues = records.map(item => getDurationHours(item.disruptionStart, item.resolutionTime)).filter(value => value != null);
  const avgDowntime = downtimeValues.length ? downtimeValues.reduce((a, b) => a + b, 0) / downtimeValues.length : null;
  el('monthlyReportSummary').innerHTML = `<strong>Month:</strong> ${escapeHtml(month)}<br><strong>Total Complaints:</strong> ${records.length}<br><strong>Open:</strong> ${counts.Open} | <strong>In Progress:</strong> ${counts['In Progress']} | <strong>Resolved:</strong> ${counts.Resolved} | <strong>Closed:</strong> ${counts.Closed}<br><strong>Genuine Connectivity Issues:</strong> ${genuine}<br><strong>Non-Connectivity / Local Issues:</strong> ${nonConnectivity}<br><strong>Average Downtime:</strong> ${formatHours(avgDowntime)}`;
  renderBarList('reportStatusChart', Object.entries(counts), 'No status data for selected month.');
  renderBarList('reportProviderChart', Object.entries(providerCounts).sort((a, b) => b[1] - a[1]), 'No provider comparison available.');
  renderBarList('reportIssueChart', Object.entries(issueCounts).sort((a, b) => b[1] - a[1]), 'No issue comparison available.');
  if (!records.length) return el('monthlyReportTable').innerHTML = '<div class="empty-state">No complaints found for the selected month.</div>';
  el('monthlyReportTable').innerHTML = `
    <table>
      <thead><tr><th>Site Name</th><th>Incharge Name</th><th>Complaint ID</th><th>Disruption Time</th><th>Issue Nature</th><th>Validated Cause</th><th>Provider</th><th>Status</th><th>Downtime</th></tr></thead>
      <tbody>${records.map(item => `<tr><td>${escapeHtml(item.dauName)}</td><td>${escapeHtml(item.inchargeName)}</td><td>${escapeHtml(item.complaintId)}</td><td>${escapeHtml(formatDateTime(item.disruptionStart))}</td><td>${escapeHtml(item.issueNature)}</td><td>${escapeHtml(item.validatedCause)}</td><td>${escapeHtml(item.provider)}</td><td>${escapeHtml(item.status)}</td><td>${escapeHtml(formatHours(getDurationHours(item.disruptionStart, item.resolutionTime)))}</td></tr>`).join('')}</tbody>
    </table>
  `;
}

function exportCsv(filename, records, columns) {
  const rows = [columns.map(col => `"${String(col.label).replace(/"/g, '""')}"`).join(',')];
  records.forEach(record => {
    rows.push(columns.map(col => {
      const value = typeof col.value === 'function' ? col.value(record) : record[col.value];
      return `"${String(value ?? '').replace(/"/g, '""')}"`;
    }).join(','));
  });
  downloadBlob(filename, new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' }));
}

function exportComplaintsCsv(records = state.complaints, filename = 'nadra-complaints.csv') {
  exportCsv(filename, records, [
    { label: 'Complaint ID', value: 'complaintId' },
    { label: 'Site Name', value: 'dauName' },
    { label: 'District', value: 'district' },
    { label: 'Incharge Name', value: 'inchargeName' },
    { label: 'Incharge Contact', value: 'inchargeContact' },
    { label: 'Link Role', value: 'linkRole' },
    { label: 'Provider', value: 'provider' },
    { label: 'Primary Media', value: item => item.sitePrimaryMedia || getSiteByName(item.dauName)?.primaryMedia || '' },
    { label: 'Primary Bandwidth', value: item => item.sitePrimaryBandwidth || getSiteByName(item.dauName)?.primaryBandwidth || '' },
    { label: 'Secondary Media', value: item => item.siteSecondaryMedia || getSiteByName(item.dauName)?.secondaryMedia || '' },
    { label: 'Secondary Bandwidth', value: item => item.siteSecondaryBandwidth || getSiteByName(item.dauName)?.secondaryBandwidth || '' },
    { label: 'Issue Nature', value: 'issueNature' },
    { label: 'Validated Cause', value: 'validatedCause' },
    { label: 'Disruption Start', value: 'disruptionStart' },
    { label: 'Resolution Time', value: 'resolutionTime' },
    { label: 'Status', value: 'status' },
    { label: 'Downtime (Hours)', value: item => getDurationHours(item.disruptionStart, item.resolutionTime)?.toFixed(2) || '' },
    { label: 'Telecom Ticket', value: 'telecomTicket' },
    { label: 'Remarks', value: 'remarks' }
  ]);
}

function exportAdCsv(records = state.adRequests, filename = 'nadra-ad-support.csv') {
  exportCsv(filename, records, [
    { label: 'Employee Name', value: 'employeeName' },
    { label: 'Employee Ref', value: 'employeeRef' },
    { label: 'Old Site', value: 'oldDau' },
    { label: 'New Site', value: 'newDau' },
    { label: 'Request Type', value: 'requestType' },
    { label: 'HR Order', value: 'hrOrder' },
    { label: 'Requested By', value: 'requestedBy' },
    { label: 'Status', value: 'status' },
    { label: 'Request Date', value: 'requestDate' },
    { label: 'Completed Date', value: 'completedDate' },
    { label: 'Notes', value: 'notes' }
  ]);
}

function exportTasksCsv(records = state.techTasks, filename = 'nadra-technical-tasks.csv') {
  exportCsv(filename, records, [
    { label: 'Location', value: 'locationName' },
    { label: 'Section Name', value: 'sectionName' },
    { label: 'Origin', value: 'origin' },
    { label: 'Task Type', value: 'taskType' },
    { label: 'System / Equipment', value: 'asset' },
    { label: 'Priority', value: 'priority' },
    { label: 'Status', value: 'status' },
    { label: 'Request Date', value: 'requestDate' },
    { label: 'Completed Date', value: 'completedDate' },
    { label: 'Requested By', value: 'requestedBy' },
    { label: 'Remarks', value: 'remarks' }
  ]);
}

function exportInventoryCsv(records = state.inventoryRecords, filename = 'nadra-site-inventory.csv') {
  exportCsv(filename, records, [
    { label: 'Site Name', value: 'siteName' },
    { label: 'Site Type', value: 'siteType' },
    { label: 'Make', value: 'make' },
    { label: 'Model', value: 'model' },
    { label: 'Serial No', value: 'serialNo' },
    { label: 'Device IP', value: 'deviceIp' },
    { label: 'LAN IP', value: 'lanIp' },
    { label: 'Firewall Model', value: 'firewallModel' },
    { label: 'Firewall Serial', value: 'firewallSerial' },
    { label: 'Firewall IP', value: 'firewallIp' },
    { label: 'Firewall Bandwidth', value: 'firewallBandwidth' },
    { label: 'Switch Model', value: 'switchModel' },
    { label: 'Switch Serial', value: 'switchSerial' },
    { label: 'Switch IP', value: 'switchIp' },
    { label: 'Switch Bandwidth', value: 'switchBandwidth' },
    { label: 'Primary Media', value: 'primaryMedia' },
    { label: 'Primary Bandwidth', value: 'primaryBandwidth' },
    { label: 'Primary Media IP', value: 'primaryMediaIp' },
    { label: 'Secondary Media', value: 'secondaryMedia' },
    { label: 'Secondary Bandwidth', value: 'secondaryBandwidth' },
    { label: 'Secondary Media IP', value: 'secondaryMediaIp' },
    { label: 'DVBrcs IP', value: 'dvbrcsIp' },
    { label: 'Remarks', value: 'remarks' }
  ]);
}

function exportBackupJson() { downloadBlob('nadra-network-complaint-backup.json', new Blob([JSON.stringify({ state, users }, null, 2)], { type: 'application/json' })); }
function downloadSampleDataset() { downloadBlob('nadra-network-complaint-sample-data.json', new Blob([JSON.stringify({ state: sampleState, users: DEFAULT_USERS }, null, 2)], { type: 'application/json' })); }

function importBackupJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const importedState = parsed.state || parsed;
      if (!Array.isArray(importedState.complaints) || !Array.isArray(importedState.adRequests)) throw new Error('Invalid backup format.');
      state = {
        siteDirectory: normalizeSiteDirectory(Array.isArray(importedState.siteDirectory) && importedState.siteDirectory.length ? importedState.siteDirectory : copy(defaultSiteDirectory)),
        complaints: importedState.complaints,
        adRequests: importedState.adRequests,
        inventoryRecords: Array.isArray(importedState.inventoryRecords) ? importedState.inventoryRecords : [],
        techTasks: Array.isArray(importedState.techTasks) ? importedState.techTasks : []
      };
      if (Array.isArray(parsed.users) && parsed.users.length) { users = parsed.users; saveUsers(); }
      saveState();
      syncSessionWithUsers();
      renderAll();
      alert('Backup imported successfully.');
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

function clearAllData() {
  if (!confirm('This will remove all locally stored complaint, AD, directory, and technical task data. Continue?')) return;
  state.complaints = [];
  state.adRequests = [];
  state.inventoryRecords = [];
  state.techTasks = [];
  saveState();
  renderAll();
}

function printMonthlyReport() {
  if (!el('reportMonth').value) el('reportMonth').value = new Date().toISOString().slice(0, 7);
  const month = el('reportMonth').value;
  const records = state.complaints.filter(item => monthKey(item.disruptionStart) === month);
  const rows = records.map(item => `<tr><td>${escapeHtml(item.dauName)}</td><td>${escapeHtml(item.inchargeName)}</td><td>${escapeHtml(item.complaintId)}</td><td>${escapeHtml(formatDateTime(item.disruptionStart))}</td><td>${escapeHtml(item.issueNature)}</td><td>${escapeHtml(item.validatedCause)}</td><td>${escapeHtml(item.provider)}</td><td>${escapeHtml(getComplaintMediaSummary(item))}</td><td>${escapeHtml(item.status)}</td><td>${escapeHtml(formatHours(getDurationHours(item.disruptionStart, item.resolutionTime)))}</td></tr>`).join('');
  const win = window.open('', '_blank');
  if (!win) return alert('Popup blocked. Please allow popups to print the report.');
  win.document.write(`
    <html><head><title>NADRA Monthly Report - ${month}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111827;}h1{margin-bottom:6px;color:#0f7b35;}p{color:#475569;}table{width:100%;border-collapse:collapse;margin-top:20px;}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left;font-size:12px;}th{background:#f8fafc;}</style></head>
    <body><h1>NADRA Network Complaint Management System</h1><p>RHO Quetta Region | Month: ${escapeHtml(month)}</p><table><thead><tr><th>Site Name</th><th>Incharge</th><th>Complaint ID</th><th>Disruption Time</th><th>Issue Nature</th><th>Validated Cause</th><th>Provider</th><th>Site Media Profile</th><th>Status</th><th>Downtime</th></tr></thead><tbody>${rows || '<tr><td colspan="9">No data available for selected month.</td></tr>'}</tbody></table><script>window.print()</script></body></html>
  `);
  win.document.close();
}

function buildUsersTable(records) {
  if (!records.length) return '<div class="empty-state">No users found.</div>';
  return `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Role</th>
          <th>Page Access</th>
          <th>Status</th>
          <th>Password</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${records.map(user => `
          <tr>
            <td><strong>${escapeHtml(user.name)}</strong></td>
            <td>${escapeHtml(user.username)}</td>
            <td>${escapeHtml(user.role)}</td>
            <td><span class="hint">${escapeHtml(roleAccessLabel(user.role))}</span></td>
            <td><span class="badge ${user.status === 'Active' ? 'resolved' : 'not-connectivity'}">${escapeHtml(user.status)}</span></td>
            <td><code>${escapeHtml(user.password)}</code></td>
            <td><div class="row-actions"><button type="button" class="tiny action-user-edit" data-id="${user.id}">Edit</button><button type="button" class="tiny action-user-toggle" data-id="${user.id}">${user.status === 'Active' ? 'Deactivate' : 'Activate'}</button></div></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderUsersTable() { el('usersTable').innerHTML = buildUsersTable(getFilteredUsers()); }

function handleLoginSubmit(event) {
  event.preventDefault();
  users = loadUsers();
  const username = el('loginUsername').value.trim().toLowerCase();
  const password = el('loginPassword').value.trim();
  const user = users.find(item => item.username.toLowerCase() === username && item.password === password && item.status === 'Active');
  if (!user) { el('loginMessage').textContent = 'Invalid or inactive credentials. Please use one of the demo credentials shown below.'; return; }
  el('loginMessage').textContent = '';
  saveSession({ id: user.id, username: user.username, name: user.name, role: user.role });
  showApp(user.name);
  renderAll();
}

function logout() { clearSession(); showLogin(); }

function renderAll() {
  users = loadUsers();
  state.siteDirectory = normalizeSiteDirectory(state.siteDirectory);
  renderSiteOptions();
  populateProviderFilter();
  updateMiniStats();
  renderDashboard();
  renderComplaintsTable();
  renderDirectoryTable();
  renderBalochistanMap();
  renderInventorySummary();
  renderInventoryTable();
  renderAdSummary();
  renderAdTable();
  renderTechnicalSummary();
  renderTasksTable();
  renderUsersTable();
  renderRoleSummary();
  populateAiComplaintSelect();
  generateMonthlyReport();
  applyRoleVisibility();
}

function handleTableClicks(event) {
  const target = event.target;
  const id = target.dataset.id;
  if (!id) return;
  if (target.classList.contains('action-edit')) editComplaint(id);
  if (target.classList.contains('action-delete')) deleteComplaint(id);
  if (target.classList.contains('action-ai')) runAiForSelectedComplaint(id);
  if (target.classList.contains('action-close')) closeComplaint(id);
  if (target.classList.contains('action-ad-edit')) editAdRequest(id);
  if (target.classList.contains('action-ad-delete')) deleteAdRequest(id);
  if (target.classList.contains('action-task-edit')) editTask(id);
  if (target.classList.contains('action-task-delete')) deleteTask(id);
  if (target.classList.contains('action-user-edit')) editUser(id);
  if (target.classList.contains('action-user-toggle')) toggleUser(id);
  if (target.classList.contains('action-inventory-edit')) editInventory(id);
  if (target.classList.contains('action-inventory-delete')) deleteInventory(id);
  if (target.classList.contains('action-directory-edit')) editDirectory(id);
  if (target.classList.contains('action-directory-delete')) deleteDirectory(id);
}

function bindEvents() {
  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab.dataset.tab)));
  window.addEventListener('hashchange', () => {
    const tabId = location.hash.replace('#', '').trim();
    if (isValidTabId(tabId)) activateTab(tabId, { updateHash: false, persist: true });
  });
  document.querySelectorAll('[data-go-tab]').forEach(button => button.addEventListener('click', () => { activateTab(button.dataset.goTab); scrollToPanel(button.dataset.goTab); }));

  el('loginForm').addEventListener('submit', handleLoginSubmit);
  el('logoutBtn').addEventListener('click', logout);
  el('quickComplaintBtn').addEventListener('click', () => { activateTab('complaints'); scrollToPanel('complaints'); el('dauName').focus(); });
  el('quickReportBtn').addEventListener('click', () => { activateTab('reports'); scrollToPanel('reports'); });

  el('siteTemplate').addEventListener('change', applySiteTemplate);
  el('dauName').addEventListener('change', syncTypedSite);
  el('dauName').addEventListener('blur', syncTypedSite);
  el('issueNature').addEventListener('change', autoSetValidatedCause);
  el('linkRole').addEventListener('change', () => { autoSetValidatedCause(); refreshComplaintProviderOptions(); });
  el('status').addEventListener('change', () => {
    if (['Resolved', 'Closed', 'Not Connectivity'].includes(el('status').value) && !el('resolutionTime').value) el('resolutionTime').value = defaultDateTimeLocal();
  });
  el('complaintForm').addEventListener('submit', handleComplaintSubmit);
  el('complaintResetBtn').addEventListener('click', resetComplaintForm);
  el('complaintSearch').addEventListener('input', renderComplaintsTable);
  el('complaintStatusFilter').addEventListener('change', renderComplaintsTable);
  el('complaintProviderFilter').addEventListener('change', renderComplaintsTable);
  el('complaintsTable').addEventListener('click', handleTableClicks);

  el('generateMonthlyReportBtn').addEventListener('click', generateMonthlyReport);
  el('printMonthlyReportBtn').addEventListener('click', printMonthlyReport);
  el('exportMonthlyCsvBtn').addEventListener('click', () => exportComplaintsCsv(state.complaints.filter(item => monthKey(item.disruptionStart) === el('reportMonth').value), `nadra-monthly-disruption-report-${el('reportMonth').value}.csv`));
  el('reportMonth').addEventListener('change', generateMonthlyReport);

  el('mapTypeFilter').addEventListener('change', () => { renderBalochistanMap(); renderMapSiteDetail(); });

  el('directoryType').addEventListener('change', () => {
    const defaults = getDefaultMediaProfile(el('directoryType').value);
    el('directoryPrimaryMedia').value = defaults.primaryMedia;
    el('directoryPrimaryBandwidth').value = defaults.primaryBandwidth;
    el('directorySecondaryMedia').value = defaults.secondaryMedia;
    el('directorySecondaryBandwidth').value = defaults.secondaryBandwidth;
  });
  el('directoryForm').addEventListener('submit', handleDirectorySubmit);
  el('directoryResetBtn').addEventListener('click', resetDirectoryForm);
  el('directorySearch').addEventListener('input', renderDirectoryTable);
  el('directoryTypeFilter').addEventListener('change', renderDirectoryTable);
  el('directoryTable').addEventListener('click', handleTableClicks);

  el('inventorySiteTemplate').addEventListener('change', applyInventorySiteTemplate);
  el('inventoryForm').addEventListener('submit', handleInventorySubmit);
  el('inventoryResetBtn').addEventListener('click', resetInventoryForm);
  el('inventorySearch').addEventListener('input', renderInventoryTable);
  el('inventoryTable').addEventListener('click', handleTableClicks);
  el('exportInventoryCsvBtn').addEventListener('click', () => exportInventoryCsv(getFilteredInventory(), 'nadra-inventory-filtered.csv'));

  el('taskSiteTemplate').addEventListener('change', applyTaskSiteTemplate);
  el('taskForm').addEventListener('submit', handleTaskSubmit);
  el('taskResetBtn').addEventListener('click', resetTaskForm);
  el('taskSearch').addEventListener('input', renderTasksTable);
  el('taskTypeFilter').addEventListener('change', renderTasksTable);
  el('taskTable').addEventListener('click', handleTableClicks);
  el('exportTasksCsvBtn').addEventListener('click', () => exportTasksCsv(getFilteredTasks(), 'nadra-technical-tasks-filtered.csv'));

  el('adForm').addEventListener('submit', handleAdSubmit);
  el('adResetBtn').addEventListener('click', resetAdForm);
  el('adSearch').addEventListener('input', renderAdTable);
  el('adTypeFilter').addEventListener('change', renderAdTable);
  el('adTable').addEventListener('click', handleTableClicks);
  el('exportAdCsvBtn').addEventListener('click', () => exportAdCsv(getFilteredAdRequests(), 'nadra-ad-support-filtered.csv'));

  el('userForm').addEventListener('submit', handleUserSubmit);
  el('userResetBtn').addEventListener('click', resetUserForm);
  el('userSearch').addEventListener('input', renderUsersTable);
  el('usersTable').addEventListener('click', handleTableClicks);

  el('runAiBtn').addEventListener('click', () => runAiForSelectedComplaint());
  el('loadPromptBtn').addEventListener('click', () => { el('aiOutput').textContent = AI_SYSTEM_PROMPT; });

  el('exportComplaintsCsvBtn').addEventListener('click', () => exportComplaintsCsv(getFilteredComplaints(), 'nadra-complaints-filtered.csv'));
  el('backupBtn').addEventListener('click', exportBackupJson);
  el('downloadTemplateBtn').addEventListener('click', downloadSampleDataset);
  el('clearDataBtn').addEventListener('click', clearAllData);
  el('loadSampleBtn').addEventListener('click', () => {
    if (!confirm('Reload the original sample data? This will overwrite current complaints, directory entries, AD requests, and technical tasks.')) return;
    state = copy(sampleState);
    state.siteDirectory = normalizeSiteDirectory(state.siteDirectory);
    saveState();
    renderAll();
    resetComplaintForm();
    resetAdForm();
    resetTaskForm();
    resetDirectoryForm();
  });
  el('importFileInput').addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (file) importBackupJson(file);
    event.target.value = '';
  });
}

renderSiteOptions();
bindEvents();
renderAll();
resetComplaintForm();
resetAdForm();
resetTaskForm();
resetDirectoryForm();
resetUserForm();
initAuth();
