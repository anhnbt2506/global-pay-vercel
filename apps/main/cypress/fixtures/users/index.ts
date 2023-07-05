const COGNITO_ID = 'aadb5ce1-ef39-44a5-af2c-33cb9d45a321';

const contextEmploymentId = 'p61xuckag3zotfw62mvji4xpqsznlerh';
const contextCompanyId = '6apkge7eoaztagse';
const contextCompanyName = 'crobakai';

export const COMPANY_OWNER = {
  cognitoId: COGNITO_ID,
  email: 'company-owner@ayp-group.com',
  firstName: 'Company',
  lastName: 'Owner',
  userContexts: [
    {
      userContextId: COGNITO_ID,
      role: 'gp:company:owner',
    },
  ],
  selectedUserContext: {
    userContextId: COGNITO_ID,
    role: 'gp:company:owner',
    contextCompanyId,
    contextCompanyName,
  },
};

export const WORKER = {
  cognitoId: COGNITO_ID,
  email: 'worker@ayp-group.com',
  firstName: 'Worker',
  lastName: 'User',
  userContexts: [
    {
      userContextId: COGNITO_ID,
      role: 'gp:worker:*',
    },
  ],
  selectedUserContext: {
    userContextId: COGNITO_ID,
    role: 'gp:worker:*',
    contextEmploymentId,
    contextCompanyId,
  },
};

export const STAFF_ADMIN = {
  cognitoId: COGNITO_ID,
  email: 'staff-admin@ayp-group.com',
  firstName: 'Staff',
  lastName: 'Admin',
  userContexts: [
    {
      userContextId: COGNITO_ID,
      role: 'gp:staff:admin',
    },
  ],
  selectedUserContext: {
    userContextId: COGNITO_ID,
    role: 'gp:staff:admin',
  },
};

export const STAFF_AUDITOR = {
  cognitoId: COGNITO_ID,
  email: 'staff-auditor@ayp-group.com',
  firstName: 'Staff',
  lastName: 'Auditor',
  userContexts: [
    {
      userContextId: COGNITO_ID,
      role: 'gp:staff:auditor',
    },
  ],
  selectedUserContext: {
    userContextId: COGNITO_ID,
    role: 'gp:staff:auditor',
  },
};

export const STAFF_LEGAL = {
  cognitoId: COGNITO_ID,
  email: 'staff-legal@ayp-group.com',
  firstName: 'Staff',
  lastName: 'Legal',
  userContexts: [
    {
      userContextId: COGNITO_ID,
      role: 'gp:staff:legal',
    },
  ],
  selectedUserContext: {
    userContextId: COGNITO_ID,
    role: 'gp:staff:legal',
  },
};

export const STAFF_MARKETING = {
  cognitoId: COGNITO_ID,
  email: 'staff-legal@ayp-group.com',
  firstName: 'Staff',
  lastName: 'Marketing',
  userContexts: [
    {
      userContextId: COGNITO_ID,
      role: 'gp:staff:marketing',
    },
  ],
  selectedUserContext: {
    userContextId: COGNITO_ID,
    role: 'gp:staff:marketing',
  },
};
