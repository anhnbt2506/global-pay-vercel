import { FC } from 'react';
import {
  Step as MuiStep,
  StepLabel as MuiStepLabel,
  StepLabelProps as MuiStepLabelProps,
  Stepper as MuiStepper,
  StepperProps as MuiStepperProps,
  StepProps as MuiStepProps,
} from '@mui/material';

export interface Step {
  label: string;
}

export interface StepperProps extends MuiStepperProps {
  steps: Step[];
  withoutLabel?: boolean;
  MuiStepProps?: MuiStepProps;
  MuiStepLabelProps?: MuiStepLabelProps;
  dataTestId?: string;
}

export const Stepper: FC<StepperProps> = ({
  steps,
  withoutLabel,
  MuiStepProps,
  MuiStepLabelProps,
  dataTestId,
  ...props
}) => (
  <MuiStepper {...props}>
    {steps.map((step, index) => (
      <MuiStep key={index} {...MuiStepProps}>
        <MuiStepLabel
          data-testid={`${dataTestId}-id-${index}`}
          {...MuiStepLabelProps}
        >
          {withoutLabel ? '' : step.label}
        </MuiStepLabel>
      </MuiStep>
    ))}
  </MuiStepper>
);
