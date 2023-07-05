import { CompanyLinking, EntityLinkStatus } from '@ayp/typings/entities';
import { AddCircle, Apartment, MoreVert } from '@mui/icons-material';
import {
  Box,
  Card,
  Grid,
  IconButton,
  MenuItem,
  Typography,
} from '@mui/material';
import { TFunction } from 'i18next';
import { truncate } from 'lodash-es';
import { FC, useState } from 'react';

import { AnchorMenu, CountryFlag } from '@components/ui';

interface EntityButtonProps {
  t: TFunction;
  buttonType: EntityLinkStatus;
  companyLinking?: CompanyLinking;
  onHandleUnlinkClick?: (companyLinking: CompanyLinking) => void;
  onCloseModal?: () => void;
  onOpenModal?: () => void;
}

const MAX_NAME_LENGTH = 16;

const EntityButton: FC<EntityButtonProps> = ({
  t,
  buttonType,
  companyLinking,
  onHandleUnlinkClick,
  onOpenModal,
}) => {
  const isStandalone = buttonType === EntityLinkStatus.STANDALONE;
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);

  const hoverStyle = (color: string, isActivePointer: boolean) => ({
    '&:hover': {
      borderColor: color,
      color: color,
      cursor: isActivePointer ? 'pointer' : 'default',
      '& .entity-management-button-more-vert-icon': {
        color: color,
      },
    },
  });

  const createEntityLinkButton = (
    <Card
      sx={(theme) => ({
        width: '12.5rem',
        height: '13rem',
        border: `1px solid ${theme.palette.text.secondary}`,
        borderRadius: '0.5rem',
        ...hoverStyle(theme.palette.primary.main, true),
      })}
      variant="outlined"
      onClick={() => onOpenModal && onOpenModal()}
      data-testid="staffAudit-clientList-entityManagementButton-addNewCompanyLinking"
    >
      <Grid
        sx={{
          visibility: 'hidden',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton
          edge="end"
          sx={{
            width: '3rem',
          }}
        >
          <MoreVert />
        </IconButton>
      </Grid>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingX: '0.5rem',
        }}
      >
        <AddCircle
          data-testid="entityManagementButton-addNewCompanyLinking-Icon"
          sx={{
            cursor: 'pointer',
            fontSize: '3rem',
          }}
        />
        <Typography
          sx={{
            fontSize: '1rem',
            marginTop: '1rem',
            fontWeight: 'bold',
          }}
        >
          {companyLinking
            ? companyLinking.name
            : t('entityManagementButton.linkEntity')}
        </Typography>
        <Box
          style={{
            marginTop: '0.5rem',
          }}
        >
          <Typography
            sx={{
              textAlign: 'center',
              lineHeight: 1,
            }}
            data-testid="entityManagementButton-createOrSelectEntity"
          >
            {t('entityManagementButton.createOrSelectEntity')}
          </Typography>
        </Box>
      </Box>
    </Card>
  );

  const companyLinkingView = (
    <Card
      sx={(theme) => ({
        width: '12.5rem',
        height: '13rem',
        border: `1px solid ${theme.palette.text.secondary}`,
        borderRadius: '0.5rem',
        ...hoverStyle(theme.palette.primary.main, false),
      })}
      variant="outlined"
    >
      <Grid
        sx={{
          visibility: 'visible',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton
          className="entity-management-button-more-vert-icon"
          edge="end"
          sx={{
            width: '3rem',
          }}
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
          data-testid="staffAudit-clientList-entityManagementButton-itemOptions"
        >
          <MoreVert />
        </IconButton>
        <AnchorMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
          <MenuItem
            onClick={() =>
              companyLinking &&
              onHandleUnlinkClick &&
              onHandleUnlinkClick(companyLinking)
            }
            data-testid="staffAudit-clientList-entityManagementButton-unlinkEntity"
          >
            <Typography marginLeft="0.5rem">
              {t('entityManagementButton.unlinkEntity')}
            </Typography>
          </MenuItem>
        </AnchorMenu>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingX: '0.5rem',
        }}
      >
        <Apartment
          sx={{
            fontSize: '3rem',
            borderRadius: '50%',
            border: `1px solid`,
            padding: '0.4rem',
          }}
        />
        <Typography
          sx={{
            fontSize: '1rem',
            marginTop: '1rem',
            fontWeight: 'bold',
          }}
          data-testid="entityManagementButton-companyName"
        >
          {companyLinking && companyLinking.name
            ? truncate(companyLinking.name, { length: MAX_NAME_LENGTH })
            : ''}
        </Typography>
        {companyLinking && companyLinking.address.country.name && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CountryFlag code={companyLinking.address.country.code ?? ''} />
            <Typography
              ml={1}
              data-testid="entityManagementButton-companyCountryName"
            >
              {truncate(companyLinking.address.country.name, {
                length: MAX_NAME_LENGTH,
              }) ?? ''}
            </Typography>
          </Box>
        )}
        <Box
          style={{
            marginTop: '0.5rem',
          }}
        >
          <Typography
            sx={{
              textAlign: 'center',
              textTransform: 'capitalize',
            }}
            data-testid="entityManagementButton-buttonType"
          >
            {buttonType.toLocaleLowerCase()}
          </Typography>
        </Box>
      </Box>
    </Card>
  );

  return isStandalone ? createEntityLinkButton : companyLinkingView;
};

export default EntityButton;
