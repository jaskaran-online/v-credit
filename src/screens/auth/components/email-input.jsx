import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, memo } from 'react';
import { Controller } from 'react-hook-form';
import { Text, TextInput } from 'react-native-paper';

import { COLORS } from '../../../core';

const EmailInput = ({ control, errors, togglePasswordVisibility }) => {
  const emailRules = useMemo(
    () => ({
      required: 'Email is required',
      pattern: {
        value: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        message: 'Invalid email address',
      },
    }),
    []
  );

  const renderIcon = ({ icon = 'email', size = 20 }) => (
    <MaterialCommunityIcons name={icon} size={size} />
  );

  return (
    <Controller
      control={control}
      rules={emailRules}
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <TextInput
            onBlur={onBlur}
            onChangeText={(text) => onChange(text)}
            value={value}
            label="Email"
            className="bg-white"
            mode="outlined"
            placeholder="Enter Email"
            placeholderTextColor={COLORS.darkGray}
            activeOutlineColor="darkgreen"
            left={<TextInput.Icon onPress={togglePasswordVisibility} icon={renderIcon} />}
          />
          {errors?.email && (
            <Text variant="bodySmall" className="mt-1 font-bold text-amber-700">
              *{errors?.email?.message}
            </Text>
          )}
        </>
      )}
      name="email"
      defaultValue=""
    />
  );
};

export default memo(EmailInput);
