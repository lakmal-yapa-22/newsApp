import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Newspaper, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { login } from '../../services/authService';

const LoginScreen = () => {
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('../home');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Login failed. Please try again.');
      } else {
        setError('Login failed. Please try again.');
      }
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 py-16 bg-black">
            <View className="items-center">
              <View className="flex-row items-center mb-4">
                <View className="justify-center items-center w-12 h-12 bg-red-600 rounded-full">
                  <Newspaper color="white" size={28} />
                </View>
                <Text className="ml-3 text-3xl font-extrabold text-white">NewsNow</Text>
              </View>
              <Text className="text-lg text-center text-white/80">
                Stay informed. Stay ahead.
              </Text>
            </View>
          </View>

          {/* Login Form */}
          <View className="px-6 py-8">
            <Text className="mb-8 text-2xl font-extrabold text-center text-neutral-900">
              Log In to Your Account
            </Text>

            {/* Error Message */}
            {error ? (
              <Text className="mb-4 font-medium text-center text-red-600">{error}</Text>
            ) : null}

            {/* Email Field */}
            <View className="mb-4">
              <Text className="mb-2 font-medium text-neutral-800">Email Address</Text>
              <View className="flex-row items-center px-4 py-3 rounded-xl border bg-neutral-50 border-neutral-200">
                <Mail color="#525252" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-neutral-900"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-6">
              <Text className="mb-2 font-medium text-neutral-800">Password</Text>
              <View className="flex-row items-center px-4 py-3 rounded-xl border bg-neutral-50 border-neutral-200">
                <Lock color="#525252" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-neutral-900"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff color="#6B7280" size={20} />
                  ) : (
                    <Eye color="#6B7280" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="py-4 mb-6 bg-red-600 rounded-xl shadow-sm"
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-lg font-semibold text-center text-white">Log In</Text>
              )}
            </TouchableOpacity>

         

          

            {/* Signup Link */}
            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-neutral-600">Don’t have an account? </Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text className="font-semibold text-red-600">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Highlights */}
          <View className="px-6 py-8 bg-neutral-50">
            <Text className="mb-4 text-xl font-extrabold text-center text-neutral-900">
              Why log in to <Text className="text-red-600">NewsNow</Text>?
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-center">
                <View className="justify-center items-center mr-4 w-8 h-8 bg-red-100 rounded-full">
                  <Text className="font-extrabold text-red-600">✓</Text>
                </View>
                <Text className="flex-1 text-neutral-700">Access your personalized news feed</Text>
              </View>

              <View className="flex-row items-center">
                <View className="justify-center items-center mr-4 w-8 h-8 bg-red-100 rounded-full">
                  <Text className="font-extrabold text-red-600">✓</Text>
                </View>
                <Text className="flex-1 text-neutral-700"> Save articles to read later </Text>
              </View>

              <View className="flex-row items-center">
                <View className="justify-center items-center mr-4 w-8 h-8 bg-red-100 rounded-full">
                  <Text className="font-extrabold text-red-600">✓</Text>
                </View>
                <Text className="flex-1 text-neutral-700">Comment & join discussions</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="px-6 py-6 bg-black">
            <Text className="text-center text-white/70">© {new Date().getFullYear()} NewsNow</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
