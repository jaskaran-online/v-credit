import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, memo } from 'react';
import { Controller } from 'react-hook-form';
import { Text, TextInput } from 'react-native-paper';

import { COLORS } from '../../../core';

const PasswordInput = ({ control, errors, isPasswordSecure, setIsPasswordSecure }) => {
  const passwordRules = useMemo(
    () => ({
      required: 'Password is required',
    }),
    []
  );
  return (
    <Controller
      control={control}
      rules={passwordRules}
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <TextInput
            onBlur={onBlur}
            onChangeText={(text) => onChange(text)}
            value={value}
            label="Password"
            placeholder="Enter Password"
            mode="outlined"
            className="bg-white"
            secureTextEntry={isPasswordSecure}
            placeholderTextColor={COLORS.darkGray}
            activeOutlineColor="darkgreen"
            right={
              <TextInput.Icon
                onPress={() => setIsPasswordSecure(!isPasswordSecure)}
                icon={() => (
                  <MaterialCommunityIcons name={isPasswordSecure ? 'eye-off' : 'eye'} size={24} />
                )}
              />
            }
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="key" size={20} />} />}
          />
          {errors?.password && (
            <Text variant="bodySmall" className="mt-1 font-bold text-amber-700">
              *{errors?.password?.message}
            </Text>
          )}
        </>
      )}
      name="password"
      defaultValue=""
    />
  );
};

export default memo(PasswordInput);
