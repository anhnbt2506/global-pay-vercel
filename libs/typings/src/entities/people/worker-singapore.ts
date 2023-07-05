export enum CpfContributionType {
  SINGAPORE_CPF_CONTRIBUTION_TYPE_FULL_CONTRIBUTION = 'SINGAPORE_CPF_CONTRIBUTION_TYPE_FULL_CONTRIBUTION',
  SINGAPORE_CPF_CONTRIBUTION_TYPE_PR_GRADUATED = 'SINGAPORE_CPF_CONTRIBUTION_TYPE_PR_GRADUATED',
  SINGAPORE_CPF_CONTRIBUTION_TYPE_NONE = 'SINGAPORE_CPF_CONTRIBUTION_TYPE_NONE',
}

export interface WorkerSingapore {
  id: number;
  cdacContribution: Nullable<boolean>;
  cpfContributionType: Nullable<CpfContributionType>;
  cpfNumber: Nullable<string>;
  ecfContribution: Nullable<boolean>;
  mbmfContribution: Nullable<boolean>;
  sindaContribution: Nullable<boolean>;
  createdAt: Date;
  updatedAt: Date;
}
