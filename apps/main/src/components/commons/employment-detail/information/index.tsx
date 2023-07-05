import {
  CountryCode,
  SortByOperator,
  StringOperator,
  UserSession,
} from '@ayp/typings/commons';
import { WorkerEmployment } from '@ayp/typings/entities';
import { CountryOption, Option } from '@ayp/typings/ui';
import { convertTimeToDateTime, getWorkerCountryCode } from '@ayp/utils';
import { Edit } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { format } from 'date-fns';
import { get } from 'lodash-es';
import memoizee from 'memoizee';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CountryFlag, Toast } from '@components/ui';
import {
  CITIZENSHIP_STATUS_LABEL_PREFIX,
  CONTRACT_TYPE_LABEL_PREFIX,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  EMERGENCY_CONTACT_RELATIONSHIP_PREFIX,
  EMPLOYMENT_TYPE_LABEL_PREFIX,
  GENDER_LABEL_PREFIX,
  HIRE_STATUS_LABEL_PREFIX,
  HIRE_TYPE_LABEL_PREFIX,
  MARITAL_LABEL_STATUS_PREFIX,
  PERMIT_TYPE_LABEL_PREFIX,
  PHILIPPINES_FIELD_MANAGERIAL_TYPE_LABEL_PREFIX,
  RACE_LABEL_PREFIX,
  RELIGION_LABEL_PREFIX,
} from '@configs/constants';
import { useSessionCookies } from '@hooks/use-session-cookies';
import { BankApi } from '@services/apis/people/bank-api';

import {
  INFORMATION_FIELDS,
  isCountryHasAddOnInformation,
  ListEditedSection,
  mapToWorkerEmploymentFormValues,
} from './config';

interface InformationProps {
  workerEmployment: WorkerEmployment;
  countries: CountryOption[];
  isEditable?: boolean;
  dataTestId?: string;
  fetchWorkerEmployment: () => Promise<void>;
}

const getBankOptionsMemo = memoizee(
  async (
    session: UserSession,
    countryCode: CountryCode
  ): Promise<Option<string>[]> => {
    try {
      const { banks } = await BankApi.getBanks(session, {
        attributes: ['bankId', 'bankName'],
        filters: [`countryCode,${StringOperator.EQUALS},${countryCode}`],
        sortBy: `bankName,${SortByOperator.ASC}`,
      });

      return banks.map(({ bankId, bankName }) => ({
        id: bankId,
        label: bankName,
        value: bankId,
      }));
    } catch (e) {
      /* istanbul ignore next */
      // this case doesn't necessary to test
      return [];
    }
  },
  { promise: true }
);

const HeaderSection: FC<{
  title: string;
  dataTestId?: string;
  onEdit?: VoidFunction;
}> = ({ title, dataTestId, onEdit }) => {
  return (
    <>
      <Grid item sm={onEdit ? 5 : 12}>
        <Typography
          sx={{
            color: (theme) => theme.palette.info.main,
            fontWeight: 'bold',
            padding: '1.5rem 0',
          }}
          data-testid={dataTestId}
        >
          {title}
        </Typography>
      </Grid>
      {onEdit && (
        <Grid
          item
          sm={7}
          sx={{
            marginY: 'auto',
          }}
        >
          <IconButton
            onClick={onEdit}
            data-testid={`${dataTestId}-button-edit`}
          >
            <Edit fontSize="small" color="primary" />
          </IconButton>
        </Grid>
      )}
    </>
  );
};

const LineSection: FC<{
  title: string;
  value?: ReactNode;
  dataTestId?: string;
}> = ({ title, value, dataTestId }) => {
  return (
    <>
      <Grid item sm={5} xs={12}>
        <Typography
          sx={{
            color: (theme) => theme.palette.text.primary,
            fontWeight: 'bold',
            paddingBottom: '0.5rem',
          }}
          data-testid={dataTestId}
        >
          {title}:
        </Typography>
      </Grid>
      <Grid item sm={7} xs={12}>
        {value}
      </Grid>
    </>
  );
};

export const Information: FC<InformationProps> = ({
  workerEmployment,
  countries,
  isEditable,
  dataTestId,
  fetchWorkerEmployment,
}) => {
  const { t } = useTranslation('employment-id-information');
  const DynamicEditAddOnEmploymentDetailsModal = useMemo(
    () => dynamic(() => import('./modal/edit-add-on-employment-details-modal')),
    []
  );

  const DynamicEditPersonalProfileModal = useMemo(
    () => dynamic(() => import('./modal/edit-personal-profile-modal')),
    []
  );

  const DynamicEditEmploymentDetailsModal = useMemo(
    () => dynamic(() => import('./modal/edit-employment-details-modal')),
    []
  );

  const DynamicEditIdentificationModal = useMemo(
    () => dynamic(() => import('./modal/edit-identification-modal')),
    []
  );

  const DynamicEditEmergencyContactModal = useMemo(
    () => dynamic(() => import('./modal/edit-emergency-contact-modal')),
    []
  );

  const DynamicBankDetailsModal = useMemo(
    () => dynamic(() => import('./modal/edit-bank-details-modal')),
    []
  );

  const [selectedEditModal, setSelectedEditModal] =
    useState<Nullable<ListEditedSection>>(null);
  const [toast, setToast] = useState<Toast>({});
  const [bankOptions, setBankOptions] = useState<Option<string>[]>([]);

  const {
    workerType,
    citizenshipStatus,
    employmentType,
    hireType,
    nationalityCode,
    currency,
    contractType,
    workerUser,
    workerIdentity,
  } = workerEmployment;
  const { gender, maritalStatus, religion, race } = workerUser ?? {};
  const { permitType } = workerIdentity ?? {};
  const countryCode = getWorkerCountryCode(workerType);
  const { session } = useSessionCookies();

  useEffect(() => {
    /* istanbul ignore next */
    // this case doesn't necessary to test
    if (!workerEmployment?.workerType || bankOptions.length) return;

    (async () => {
      const countryCode = getWorkerCountryCode(workerEmployment.workerType);

      const options = await getBankOptionsMemo(session, countryCode);
      setBankOptions(options);
    })();
  }, [session, workerEmployment.workerType, bankOptions]);

  const currentModal = useMemo(() => {
    const initialValues = mapToWorkerEmploymentFormValues(
      workerEmployment,
      countries
    );
    switch (selectedEditModal) {
      case ListEditedSection.EMPLOYMENT_DETAILS:
        return (
          <DynamicEditEmploymentDetailsModal
            initialValues={initialValues}
            onCloseModal={() => setSelectedEditModal(null)}
            onSuccess={async () => {
              setSelectedEditModal(null);
              await fetchWorkerEmployment();
            }}
            setToast={setToast}
            countryCode={countryCode}
          />
        );
      case ListEditedSection.ADD_ON_EMPLOYMENT_DETAILS:
        return (
          <DynamicEditAddOnEmploymentDetailsModal
            initialValues={initialValues}
            onCloseModal={() => setSelectedEditModal(null)}
            onSuccess={async () => {
              setSelectedEditModal(null);
              await fetchWorkerEmployment();
            }}
            setToast={setToast}
            countryCode={countryCode}
          />
        );
      case ListEditedSection.PERSONAL_PROFILE:
        return (
          <DynamicEditPersonalProfileModal
            onCloseModal={() => setSelectedEditModal(null)}
            onSuccess={async () => {
              setSelectedEditModal(null);
              await fetchWorkerEmployment();
            }}
            setToast={setToast}
            initialValues={initialValues}
            countries={countries}
          />
        );
      case ListEditedSection.EMERGENCY_CONTACT:
        return (
          <DynamicEditEmergencyContactModal
            onCloseModal={() => setSelectedEditModal(null)}
            onSuccess={async () => {
              setSelectedEditModal(null);
              await fetchWorkerEmployment();
            }}
            setToast={setToast}
            initialValues={initialValues}
            countries={countries}
          />
        );
      case ListEditedSection.IDENTIFICATION:
        return (
          <DynamicEditIdentificationModal
            onCloseModal={() => setSelectedEditModal(null)}
            onSuccess={async () => {
              setSelectedEditModal(null);
              await fetchWorkerEmployment();
            }}
            setToast={setToast}
            initialValues={initialValues}
            countryCode={countryCode}
          />
        );
      case ListEditedSection.BANKING_DETAILS:
        return (
          <DynamicBankDetailsModal
            onCloseModal={() => setSelectedEditModal(null)}
            onSuccess={async () => {
              setSelectedEditModal(null);
              await fetchWorkerEmployment();
            }}
            setToast={setToast}
            initialValues={initialValues}
            bankOptions={bankOptions}
          />
        );
      default:
        return <></>;
    }
  }, [
    DynamicEditAddOnEmploymentDetailsModal,
    DynamicEditPersonalProfileModal,
    DynamicEditEmploymentDetailsModal,
    DynamicEditEmergencyContactModal,
    DynamicEditIdentificationModal,
    selectedEditModal,
    countryCode,
    workerEmployment,
    countries,
    bankOptions,
    fetchWorkerEmployment,
    DynamicBankDetailsModal,
  ]);

  const convertToYesNoLabel = useCallback(
    (value: Nullable<boolean>) => {
      if (value === null) return '-';

      return value ? t('common:yes') : t('common:no');
    },
    [t]
  );

  const mapValueForDisplay = useCallback<(fieldName: string) => string>(
    (fieldName) => {
      switch (fieldName) {
        case 'additionalInfo.localHospitalForStatutoryMedicalInsurance':
          return (
            workerEmployment?.additionalInfo
              ?.localHospitalForStatutoryMedicalInsurance ?? '-'
          );
        case 'additionalInfo.socialInsuranceBookNo':
          return workerEmployment?.additionalInfo?.socialInsuranceBookNo ?? '-';
        case 'workerUser.address.postalCodeAlternate':
          return (
            workerEmployment?.workerUser?.address?.postalCodeAlternate ?? '-'
          );
        case 'workerUser.address.stateAlternate':
          return workerEmployment?.workerUser?.address?.stateAlternate ?? '-';
        case 'workerUser.address.cityAlternate':
          return workerEmployment?.workerUser?.address?.cityAlternate ?? '-';
        case 'workerUser.address.addressLineAlternate':
          return (
            workerEmployment?.workerUser?.address?.addressLineAlternate ?? '-'
          );
        case 'workerIdentity.taxId':
          return workerEmployment?.workerIdentity?.taxId ?? '-';
        case 'workerIdentity.permitIssuedPlaceAlternate':
          return (
            workerEmployment?.workerIdentity?.permitIssuedPlaceAlternate ?? '-'
          );
        case 'workerIdentity.passportIssuedPlaceAlternate':
          return (
            workerEmployment?.workerIdentity?.passportIssuedPlaceAlternate ??
            '-'
          );
        case 'workerIdentity.passportIssuedPlace':
          return workerEmployment?.workerIdentity?.passportIssuedPlace ?? '-';
        case 'workerIdentity.passportIssuedDate':
          const passportIssuedDate = get(workerEmployment, fieldName);
          return passportIssuedDate
            ? format(
                new Date(passportIssuedDate as unknown as string),
                DEFAULT_DATE_FORMAT
              )
            : '-';
        case 'workerIdentity.nationalIdIssuedPlaceAlternate':
          return (
            workerEmployment?.workerIdentity?.nationalIdIssuedPlaceAlternate ??
            '-'
          );
        case 'workerIdentity.nationalIdIssuedPlace':
          return workerEmployment?.workerIdentity?.nationalIdIssuedPlace ?? '-';
        case 'workerUser.userContext.user.firstNameAlternate':
          return (
            workerEmployment?.workerUser?.userContext?.user
              ?.firstNameAlternate ?? '-'
          );
        case 'workerUser.userContext.user.lastNameAlternate':
          return (
            workerEmployment?.workerUser?.userContext?.user
              ?.lastNameAlternate ?? '-'
          );
        case 'titleAlternate':
          return workerEmployment?.titleAlternate ?? '-';
        case 'workerUser.gender':
          return gender ? t(`${GENDER_LABEL_PREFIX}${gender}`) : '-';
        case 'contractType':
          return contractType
            ? t(`${CONTRACT_TYPE_LABEL_PREFIX}${contractType}`)
            : '-';
        case 'citizenshipStatus':
          return citizenshipStatus
            ? t(`${CITIZENSHIP_STATUS_LABEL_PREFIX}${citizenshipStatus}`)
            : '-';
        case 'employmentType':
          return employmentType
            ? t(`${EMPLOYMENT_TYPE_LABEL_PREFIX}${employmentType}`)
            : '-';
        case 'hireType':
          return hireType ? t(`${HIRE_TYPE_LABEL_PREFIX}${hireType}`) : '-';
        case 'workerUser.maritalStatus':
          return maritalStatus
            ? t(`${MARITAL_LABEL_STATUS_PREFIX}${maritalStatus}`)
            : '-';
        case 'workerContact.emergencyContactRelationship':
          const relationship = get(workerEmployment, fieldName);
          return relationship
            ? t<string>(
                `${EMERGENCY_CONTACT_RELATIONSHIP_PREFIX}${relationship}`
              )
            : '-';
        case 'workerUser.religion':
          return religion ? t(`${RELIGION_LABEL_PREFIX}${religion}`) : '-';
        case 'workerUser.race':
          return race ? t(`${RACE_LABEL_PREFIX}${race}`) : '-';
        case 'workerIdentity.permitType':
          return permitType
            ? t(`${PERMIT_TYPE_LABEL_PREFIX}${permitType}`)
            : '-';
        case 'additionalInfo.fieldManagerialType':
          const fieldManagerialType = get(workerEmployment, fieldName);
          return fieldManagerialType
            ? t<string>(
                `${PHILIPPINES_FIELD_MANAGERIAL_TYPE_LABEL_PREFIX}${fieldManagerialType}`
              )
            : '-';
        case 'workerContact.contactNumber':
          const contactNumber = get(workerEmployment, fieldName);
          if (contactNumber) {
            const contactDialingCode = countries.find(
              (country) =>
                country.code ===
                get(workerEmployment, 'workerContact.contactNumberCountryCode')
            )?.dialingCode;
            return `${contactDialingCode} ${contactNumber}`;
          }
          return '-';
        case 'workerContact.emergencyContactNumber':
          const emergencyContactNumber = get(workerEmployment, fieldName);
          if (emergencyContactNumber) {
            const emergencyContactDialingCode = countries.find(
              (country) =>
                country.code ===
                get(
                  workerEmployment,
                  'workerContact.emergencyContactNumberCountryCode'
                )
            )?.dialingCode;
            return `${emergencyContactDialingCode} ${emergencyContactNumber}`;
          }
          return '-';
        case 'nationalityCode':
          const country = countries.find(
            (country) => country.code === nationalityCode
          );
          return country ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CountryFlag code={country.code} />
              <Typography ml={1}>{country.label}</Typography>
            </Box>
          ) : (
            '-'
          );
        case 'workerRemuneration.salaryPerMonth':
          const salaryPerMonth = get(workerEmployment, fieldName);
          return salaryPerMonth
            ? `${currency} ${new Intl.NumberFormat().format(salaryPerMonth)}`
            : '-';
        case 'workerRemuneration.monthlyAllowance':
          const monthlyAllowance = get(workerEmployment, fieldName);
          return monthlyAllowance
            ? `${currency} ${new Intl.NumberFormat().format(monthlyAllowance)}`
            : '-';
        case 'additionalInfo.religiousFestivityAllowance':
          const religiousFestivityAllowance = get(workerEmployment, fieldName);
          return religiousFestivityAllowance
            ? `${currency} ${new Intl.NumberFormat().format(
                religiousFestivityAllowance
              )}`
            : '-';

        case 'workerRemuneration.isEligibleForInsurance':
          return convertToYesNoLabel(
            get(workerEmployment, fieldName) as unknown as boolean
          );
        case 'workerRemuneration.isEligibleForAdditionalIncome':
          return convertToYesNoLabel(
            get(workerEmployment, fieldName) as unknown as boolean
          );
        case 'workerRemuneration.isEligibleForPaidExpenses':
          return convertToYesNoLabel(
            get(workerEmployment, fieldName) as unknown as boolean
          );
        case 'workerRemuneration.isEntitledToOvertime':
          return convertToYesNoLabel(
            get(workerEmployment, fieldName) as unknown as boolean
          );
        case 'workerRemuneration.isEligibleForVariablePay':
          return convertToYesNoLabel(
            get(workerEmployment, fieldName) as unknown as boolean
          );
        case 'workerRemuneration.isEligibleForAnnualBonus':
          return convertToYesNoLabel(
            get(workerEmployment, fieldName) as unknown as boolean
          );
        case 'workerRemuneration.isEligibleForCommission':
          return convertToYesNoLabel(
            get(workerEmployment, fieldName) as unknown as boolean
          );
        case 'additionalInfo.isEntitledToOvertimeDifferential':
          return convertToYesNoLabel(
            get(workerEmployment, fieldName) as unknown as boolean
          );

        case 'startDate':
          const startDate = get(workerEmployment, fieldName);
          return startDate
            ? format(
                new Date(startDate as unknown as string),
                DEFAULT_DATE_FORMAT
              )
            : '-';
        case 'endDate':
          const endDate = get(workerEmployment, fieldName);
          return endDate
            ? format(
                new Date(endDate as unknown as string),
                DEFAULT_DATE_FORMAT
              )
            : '-';
        case 'probationStartDate':
          const probationStartDate = get(workerEmployment, fieldName);
          return probationStartDate
            ? format(
                new Date(probationStartDate as unknown as string),
                DEFAULT_DATE_FORMAT
              )
            : '-';
        case 'probationEndDate':
          const probationEndDate = get(workerEmployment, fieldName);
          return probationEndDate
            ? format(
                new Date(probationEndDate as unknown as string),
                DEFAULT_DATE_FORMAT
              )
            : '-';
        case 'workerUser.dateOfBirth':
          const dateOfBirth = get(workerEmployment, fieldName);
          return dateOfBirth
            ? format(
                new Date(dateOfBirth as unknown as string),
                DEFAULT_DATE_FORMAT
              )
            : '-';
        case 'workerIdentity.permitIssuedDate':
          const permitIssuedDate = get(workerEmployment, fieldName);
          return permitIssuedDate
            ? format(
                new Date(permitIssuedDate as unknown as string),
                DEFAULT_DATE_FORMAT
              )
            : '-';
        case 'workerIdentity.nationalIdIssuedDate':
          const nationalIdIssuedDate = get(workerEmployment, fieldName);
          return nationalIdIssuedDate
            ? format(
                new Date(nationalIdIssuedDate as unknown as string),
                DEFAULT_DATE_FORMAT
              )
            : '-';

        case 'startAt':
          const startAt = get(workerEmployment, fieldName);
          return startAt
            ? format(convertTimeToDateTime(startAt), DEFAULT_TIME_FORMAT)
            : '-';
        case 'endAt':
          const endAt = get(workerEmployment, fieldName);
          return endAt
            ? format(convertTimeToDateTime(endAt), DEFAULT_TIME_FORMAT)
            : '-';
        default:
          return get(workerEmployment, fieldName) ?? '-';
      }
    },
    [
      citizenshipStatus,
      contractType,
      convertToYesNoLabel,
      countries,
      currency,
      employmentType,
      gender,
      hireType,
      maritalStatus,
      nationalityCode,
      permitType,
      religion,
      t,
      race,
      workerEmployment,
    ]
  );

  return (
    <>
      {currentModal}
      <Toast
        open={!!toast.message}
        severity={toast.severity}
        onClose={() => setToast({ message: '' })}
        dataTestId={`${dataTestId}-information-toast`}
      >
        {toast.message}
      </Toast>
      <Grid container spacing={1} sx={{ paddingBottom: '2rem' }}>
        <HeaderSection
          title={t('informationForm.verification.title')}
          dataTestId={`${dataTestId}-informationForm.verification`}
        />
        <LineSection
          title={t('informationForm.verification.fields.currentStatus')}
          value={t(`${HIRE_STATUS_LABEL_PREFIX}${workerEmployment.status}`)}
          dataTestId={`${dataTestId}-informationForm.verification.fields.currentStatus`}
        />
        <HeaderSection
          title={t('informationForm.employmentDetails.title')}
          dataTestId={`${dataTestId}-informationForm.employmentDetails`}
          onEdit={
            !isEditable
              ? undefined
              : () => setSelectedEditModal(ListEditedSection.EMPLOYMENT_DETAILS)
          }
        />
        {INFORMATION_FIELDS.employmentDetails.map((field, key) => (
          <LineSection
            key={key}
            title={t(
              `informationForm.employmentDetails.fields.${field.labelKey}`
            )}
            value={mapValueForDisplay(field.fieldName)}
            dataTestId={`${dataTestId}-informationForm.employmentDetails.fields.${field.labelKey}`}
          />
        ))}
        {isCountryHasAddOnInformation(workerType) && (
          <>
            <HeaderSection
              title={t('informationForm.addOnEmploymentDetails.title')}
              dataTestId={`${dataTestId}-informationForm.addOnEmploymentDetails`}
              onEdit={
                !isEditable
                  ? undefined
                  : () =>
                      setSelectedEditModal(
                        ListEditedSection.ADD_ON_EMPLOYMENT_DETAILS
                      )
              }
            />
            {INFORMATION_FIELDS.addOnEmploymentDetails[
              countryCode.toLowerCase()
            ].map((field, key) => (
              <LineSection
                key={key}
                title={t(
                  `informationForm.addOnEmploymentDetails.${countryCode.toLowerCase()}.fields.${
                    field.labelKey
                  }`
                )}
                value={mapValueForDisplay(field.fieldName)}
                dataTestId={`${dataTestId}-informationForm.addOnEmploymentDetails.${countryCode}.fields.${field.labelKey}`}
              />
            ))}
          </>
        )}
        <HeaderSection
          title={t('informationForm.personalProfile.title')}
          dataTestId={`${dataTestId}-informationForm.personalProfile`}
          onEdit={
            !isEditable
              ? undefined
              : () => setSelectedEditModal(ListEditedSection.PERSONAL_PROFILE)
          }
        />
        {INFORMATION_FIELDS.personalProfile.map((field, key) => (
          <LineSection
            key={key}
            title={t(
              `informationForm.personalProfile.fields.${field.labelKey}`
            )}
            value={mapValueForDisplay(field.fieldName)}
            dataTestId={`${dataTestId}-informationForm.personalProfile.fields.${field.labelKey}`}
          />
        ))}
        <HeaderSection
          title={t('informationForm.identification.title')}
          dataTestId={`${dataTestId}-informationForm.identification`}
          onEdit={
            !isEditable
              ? undefined
              : () => setSelectedEditModal(ListEditedSection.IDENTIFICATION)
          }
        />
        {INFORMATION_FIELDS.identification.map((field, key) => (
          <LineSection
            key={key}
            title={t(`informationForm.identification.fields.${field.labelKey}`)}
            value={mapValueForDisplay(field.fieldName)}
            dataTestId={`${dataTestId}-informationForm.identification.fields.${field.labelKey}`}
          />
        ))}
        {countryCode === CountryCode.VIETNAM ? (
          <LineSection
            title={t(
              'informationForm.identification.fields.workerPreviousPermitId'
            )}
            value={workerEmployment?.additionalInfo?.oldPermitId ?? '-'}
            dataTestId={
              '${dataTestId}-informationForm.identification.fields.workerPreviousPermitId'
            }
          />
        ) : (
          <></>
        )}
        <HeaderSection
          title={t('informationForm.emergencyContact.title')}
          dataTestId={`${dataTestId}-informationForm.emergencyContact`}
          onEdit={
            !isEditable
              ? undefined
              : () => setSelectedEditModal(ListEditedSection.EMERGENCY_CONTACT)
          }
        />
        {INFORMATION_FIELDS.emergencyContact.map((field, key) => (
          <LineSection
            key={key}
            title={t(
              `informationForm.emergencyContact.fields.${field.labelKey}`
            )}
            value={mapValueForDisplay(field.fieldName)}
            dataTestId={`${dataTestId}-informationForm.emergencyContact.fields.${field.labelKey}`}
          />
        ))}
        {bankOptions.length && (
          <>
            <HeaderSection
              title={t('informationForm.bankDetails.title')}
              dataTestId={`${dataTestId}-informationForm.bankDetails`}
              onEdit={
                !isEditable
                  ? undefined
                  : () =>
                      setSelectedEditModal(ListEditedSection.BANKING_DETAILS)
              }
            />
            {INFORMATION_FIELDS.bankDetails.map((field, key) => (
              <LineSection
                key={key}
                title={t(
                  `informationForm.bankDetails.fields.${field.labelKey}`
                )}
                value={mapValueForDisplay(field.fieldName)}
                dataTestId={`${dataTestId}-informationForm.bankDetails.fields.${field.labelKey}`}
              />
            ))}
          </>
        )}
      </Grid>
    </>
  );
};
