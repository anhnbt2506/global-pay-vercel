export enum GTM_EVENTS {
  WORKER_PORTAL_LOGIN = 'wp_login',
  WORKER_PORTAL_LOGOUT = 'wp_logout',
  WORKER_PORTAL_EMPLOYMENT_SWITCH = 'wp_employment_switch',
  WORKER_PORTAL_EMPLOYMENT_SWITCH_CONFIRM = 'wp_employment_switch_confirm',
  WORKER_PORTAL_EMPLOYMENT_SWITCH_CANCEL = 'wp_employment_switch_cancel',
  WORKER_PORTAL_SIGN_CONTRACT = 'wp_sign_contract',
  WORKER_PORTAL_CONTRACT_REVIEW_LATER = 'wp_contract_review_later',
  WORKER_PORTAL_CONTRACT_SIGN = 'wp_contract_sign',
  WORKER_PORTAL_ONBOARDING_STEP1_DONE = 'wp_onboarding_step1_done',
  WORKER_PORTAL_ONBOARDING_STEP2_BACK = 'wp_onboarding_step2_back',
  WORKER_PORTAL_ONBOARDING_STEP2_DONE = 'wp_onboarding_step2_done',
  WORKER_PORTAL_ONBOARDING_STEP3_BACK = 'wp_onboarding_step3_back',
  WORKER_PORTAL_ONBOARDING_STEP3_DONE = 'wp_onboarding_step3_done',
  WORKER_PORTAL_ONBOARDING_STEP4_BACK = 'wp_onboarding_step4_back',
  WORKER_PORTAL_ONBOARDING_STEP4_DONE = 'wp_onboarding_step4_done',
  WORKER_PORTAL_ONBOARDING_STEP5_BACK = 'wp_onboarding_step5_back',
  WORKER_PORTAL_ONBOARDING_STEP5_DONE = 'wp_onboarding_step5_done',

  CLIENT_PORTAL_CREATE_ACCOUNT = 'cp_create_account',
  CLIENT_PORTAL_LOGIN = 'cp_login',
  CLIENT_PORTAL_LOGOUT = 'cp_logout',
  CLIENT_PORTAL_SERVICE_CHOICES_LEAVE = 'cp_service_choices_leave',
  CLIENT_PORTAL_ADD_PEO_EOR_SERVICE = 'cp_add_peo_eor_service',
  CLIENT_PORTAL_ADD_POM_SERVICE = 'cp_add_pom_service',
  CLIENT_PORTAL_CREATE_SELF_ONBOARDING_STEP1_COMPLETE = 'cp_self_onboarding_step1_done',
  CLIENT_PORTAL_SELF_ONBOARDING_STEP2_BACK = 'cp_self_onboarding_step2_back',
  CLIENT_PORTAL_CREATE_SELF_ONBOARDING_STEP2_COMPLETE = 'cp_self_onboarding_step2_done',
  CLIENT_PORTAL_ADD_POM_SERVICE_AGREEMENT_LATER = 'cp_add_pom_servagree_later',
  CLIENT_PORTAL_ADD_POM_SERVICE_AGREEMENT_ACK = 'cp_add_pom_servagree_ack',
  CLIENT_PORTAL_ADD_POM_SERVICE_AGREEMENT_COMMENT = 'cp_add_pom_servagree_comment',
  CLIENT_PORTAL_ADD_PEO_EOR_SERVICE_AGREEMENT_LATER = 'cp_add_peo_eor_servagree_later',
  CLIENT_PORTAL_ADD_PEO_EOR_SERVICE_AGREEMENT_ACK = 'cp_add_peo_eor_servagree_ack',
  CLIENT_PORTAL_ADD_PEO_EOR_SERVICE_AGREEMENT_COMMENT = 'cp_add_peo_eor_servagree_comment',

  CLIENT_PORTAL_ADD_POM_SERVICE_STEP1_LEAVE = 'cp_add_pom_service_step1_leave',
  CLIENT_PORTAL_ADD_POM_SERVICE_STEP1_DONE = 'cp_add_pom_service_step1_done',
  CLIENT_PORTAL_ADD_POM_SERVICE_HK_LEAVE = 'cp_add_pom_service_hk_leave',
  CLIENT_PORTAL_ADD_POM_SERVICE_HK_DONE = 'cp_add_pom_service_hk_done',
  CLIENT_PORTAL_ADD_POM_SERVICE_ID_LEAVE = 'cp_add_pom_service_id_leave',
  CLIENT_PORTAL_ADD_POM_SERVICE_ID_DONE = 'cp_add_pom_service_id_done',
  CLIENT_PORTAL_ADD_POM_SERVICE_MY_LEAVE = 'cp_add_pom_service_my_leave',
  CLIENT_PORTAL_ADD_POM_SERVICE_MY_DONE = 'cp_add_pom_service_my_done',
  CLIENT_PORTAL_ADD_POM_SERVICE_PH_LEAVE = 'cp_add_pom_service_ph_leave',
  CLIENT_PORTAL_ADD_POM_SERVICE_PH_DONE = 'cp_add_pom_service_ph_done',
  CLIENT_PORTAL_ADD_POM_SERVICE_SG_LEAVE = 'cp_add_pom_service_sg_leave',
  CLIENT_PORTAL_ADD_POM_SERVICE_SG_DONE = 'cp_add_pom_service_sg_done',
  CLIENT_PORTAL_ADD_POM_SERVICE_TH_LEAVE = 'cp_add_pom_service_th_leave',
  CLIENT_PORTAL_ADD_POM_SERVICE_TH_DONE = 'cp_add_pom_service_th_done',
  CLIENT_PORTAL_ADD_POM_SERVICE_VN_LEAVE = 'cp_add_pom_service_vn_leave',
  CLIENT_PORTAL_ADD_POM_SERVICE_VN_DONE = 'cp_add_pom_service_vn_done',
  CLIENT_PORTAL_ADD_POM_SERVICE_STEP2_DONE = 'cp_add_pom_service_step2_done',
  CLIENT_PORTAL_ADD_POM_SERVICE_STEP2_LEAVE = 'cp_add_pom_service_step2_leave',
  CLIENT_PORTAL_ADD_POM_SERVICE_STEP3_LEAVE = 'cp_add_pom_service_step3_leave',
  CLIENT_PORTAL_ADD_POM_SERVICE_STEP3_CHECK = 'cp_add_pom_service_step3_check',
  CLIENT_PORTAL_ADD_POM_SERVICE_STEP3_DONE = 'cp_add_pom_service_step3_done',
  CLIENT_PORTAL_ADD_POM_SERVICE_DONE_PAYROLL = 'cp_add_pom_service_done_payroll',
  CLIENT_PORTAL_ADD_POM_SERVICE_DONE_WORKFORCE = 'cp_add_pom_service_done_workforce',
  CLIENT_PORTAL_ELIGIBLE_HIRE_PEO_ASSISTANCE = 'cp_eligible_hire_peo_assistance',
  CLIENT_PORTAL_ELIGIBLE_HIRE_LEAVE = 'cp_eligible_hire_leave',
  CLIENT_PORTAL_ELIGIBLE_HIRE_DONE = 'cp_eligible_hire_done',

  CLIENT_PORTAL_ADD_EOR_SERVICE_STEP1_LEAVE = 'cp_add_eor_service_step1_leave',
  CLIENT_PORTAL_ADD_EOR_SERVICE_STEP1_DONE = 'cp_add_eor_service_step1_done',
  CLIENT_PORTAL_ADD_EOR_SERVICE_STEP2_BACK = 'cp_add_eor_service_step2_back',
  CLIENT_PORTAL_ADD_EOR_SERVICE_STEP2_DONE = 'cp_add_eor_service_step2_done',
  CLIENT_PORTAL_ADD_EOR_SERVICE_STEP3_BACK = 'cp_add_eor_service_step3_back',
  CLIENT_PORTAL_ADD_EOR_SERVICE_STEP3_DONE = 'cp_add_eor_service_step3_done',
  CLIENT_PORTAL_ADD_EOR_SERVICE_STEP4_BACK = 'cp_add_eor_service_step4_back',
  CLIENT_PORTAL_ADD_EOR_SERVICE_STEP4_DONE = 'cp_add_eor_service_step4_done',
  CLIENT_PORTAL_ADD_EOR_SERVICE_STEP5_BACK = 'cp_add_eor_service_step5_back',
  CLIENT_PORTAL_ADD_EOR_SERVICE_STEP5_DONE = 'cp_add_eor_service_step5_done',
  CLIENT_PORTAL_ADD_EOR_SERVICE_STEP6_BACK = 'cp_add_eor_service_step6_back',
  CLIENT_PORTAL_ADD_EOR_SERVICE_STEP6_DONE = 'cp_add_eor_service_step6_done',
  CLIENT_PORTAL_ADD_EOR_SERVICE_DONE_HIRE = 'cp_add_eor_service_done_hire',
  CLIENT_PORTAL_ADD_EOR_SERVICE_DONE_CONTRACT = 'cp_add_eor_service_done_contract',
  CLIENT_PORTAL_ADD_EOR_SERVICE_DONE_SUMMARY = 'cp_add_eor_service_done_summary',

  CLIENT_PORTAL_ONBOARDING_ADD_NEW_HIRE = 'cp_onboarding_add_new_hire',

  STAFF_PORTAL_LOGOUT = 'staff_portal_logout',
}
