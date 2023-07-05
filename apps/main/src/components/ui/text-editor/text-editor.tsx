import { Environment, getErrorFieldProps } from '@ayp/utils';
import {
  Box,
  CircularProgress,
  FormHelperText,
  InputLabel,
} from '@mui/material';
import { Editor, IAllProps } from '@tinymce/tinymce-react';
import { useFormikContext } from 'formik';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

interface TextEditorProps extends IAllProps {
  name: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  autoFillTags?: string[];
}

export const TextEditor: FC<TextEditorProps> = ({
  name,
  label,
  required,
  helperText,
  autoFillTags = [],
  ...props
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [initialValue, setInitialValue] = useState('');
  const { submitCount, getFieldMeta, getFieldProps, getFieldHelpers } =
    useFormikContext();
  const [meta, , helpers] = [
    getFieldMeta(name),
    getFieldProps(name),
    getFieldHelpers(name),
  ];
  const { error, helperText: errorHelperText } = getErrorFieldProps(
    meta,
    submitCount
  );

  useEffect(() => {
    setInitialValue(meta.initialValue as string);
  }, [meta.initialValue]);

  const defaultInit = {
    branding: false,
    convert_urls: false,
    plugins: Object.assign(
      [
        'anchor',
        'autolink',
        'charmap',
        'code',
        'help',
        'image',
        'insertdatetime',
        'link',
        'lists',
        'media',
        'preview',
        'quickbars',
        'searchreplace',
        'table',
        'visualblocks',
        'wordcount',
      ],
      autoFillTags.length && ['autoFillTags']
    ),
    toolbar:
      'undo redo | formatselect | bold italic | \
      alignleft aligncenter alignright | \
      bullist numlist outdent indent | help',
    ...props.init,
  };

  const setup = useCallback(() => {
    window.tinymce.PluginManager.add('autoFillTags', (editor) => {
      const commands = autoFillTags.map((autoFillTag) => ({
        text: `{{${autoFillTag}}}`,
        action: () =>
          editor.execCommand('mceInsertContent', false, `{{${autoFillTag}}}`),
      }));

      editor.ui.registry.addAutocompleter('autoFillTags', {
        ch: '{',
        columns: 1,
        minChars: 0,
        fetch: async (pattern) => {
          const matchedCommand = commands.filter(
            (action) =>
              action.text.toLowerCase().indexOf(pattern.toLowerCase()) !== -1
          );

          return matchedCommand.map((action) => ({
            meta: action,
            text: action.text,
            value: action.text,
          }));
        },
        onAction: (autocompleteApi, rng, action, meta) => {
          editor.selection.setRng(rng);
          editor.execCommand('Delete');
          meta.action();
          autocompleteApi.hide();
        },
      });
    });

    return {};
  }, [autoFillTags]);

  return (
    <Box
      sx={{
        '& .tox-tinymce': {
          borderRadius: '0.5rem',
          border: (theme) =>
            `1px solid ${
              error ? theme.palette.error.main : 'rgba(0, 0, 0, 0.42)'
            }`,
        },
      }}
    >
      {label && (
        <InputLabel
          required={required}
          sx={{
            marginBottom: '0.5rem',
            fontSize: '0.75rem',
            paddingLeft: '0.8rem',
          }}
        >
          {label}
        </InputLabel>
      )}
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Editor
        id={name}
        apiKey={Environment.getTinyMceApiKey()}
        {...props}
        initialValue={initialValue}
        onInit={() => setLoading(false)}
        onChange={(e) => helpers.setValue(e.target.getContent())}
        init={{
          ...defaultInit,
          ...props.init,
          setup,
          placeholder: helperText,
        }}
      />
      <FormHelperText error={error}>
        {error && errorHelperText && t(errorHelperText)}
      </FormHelperText>
    </Box>
  );
};
