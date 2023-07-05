export interface WorkerThaiLand {
  id: number;
  fatherAllowance: Nullable<number>;
  motherAllowance: Nullable<number>;
  spouseFatherAllowance: Nullable<number>;
  spouseMotherAllowance: Nullable<number>;
  insurancePremium: Nullable<number>;
  spouseInsurancePremium: Nullable<number>;
  fatherInsurancePremium: Nullable<number>;
  motherInsurancePremium: Nullable<number>;
  interestHousingLoan: Nullable<number>;
  educationDonationAmount: Nullable<number>;
  rmfAllowance: Nullable<number>;
  ltfAllowance: Nullable<number>;
  hospitalForUnemploymentInsurance: Nullable<string>;
  houseRegistrationFile: Nullable<string>;
  taxDeductionForm: Nullable<number>;
  createdAt: Date;
  updatedAt: Date;
}
