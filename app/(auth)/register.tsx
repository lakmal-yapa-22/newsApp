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
} from 'react-native';
import { Newspaper, User, Mail, Lock, MapPin, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Register } from '@/services/authService';

const Signup = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // UI-only: password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    if (!email || !password || !confirmPassword || !name) {
      alert('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await Register(email, password, name, location);
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      console.log('Registration attempted with:', { email, password, name, location });
      setTimeout(() => setIsLoading(false), 1500);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Hero / Header */}
          <View className="px-6 py-12 bg-black">
            <View className="items-center">
              <View className="flex-row items-center mb-3">
                <View className="justify-center items-center w-12 h-12 bg-red-600 rounded-full">
                  <Newspaper color="white" size={26} />
                </View>
                <Text className="ml-3 text-3xl font-extrabold tracking-tight text-white">
                  NewsNow
                </Text>
              </View>
              <Text className="text-base text-center text-white/80">
                Join the community. Break news. Stay updated.
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View className="px-6 -mt-6">
            <View className="p-6 bg-white rounded-2xl border shadow-sm border-neutral-200">
              <Text className="mb-6 text-2xl font-extrabold text-center text-neutral-900">
                Create Your Account
              </Text>

              {/* Name */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-neutral-800">Name</Text>
                <View className="flex-row items-center px-4 py-3 rounded-xl border bg-neutral-50 border-neutral-200">
                  <User color="#525252" size={20} />
                  <TextInput
                    className="flex-1 ml-3 text-neutral-900"
                    placeholder="Jane Doe"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-neutral-800">Email Address</Text>
                <View className="flex-row items-center px-4 py-3 rounded-xl border bg-neutral-50 border-neutral-200">
                  <Mail color="#525252" size={20} />
                  <TextInput
                    className="flex-1 ml-3 text-neutral-900"
                    placeholder="jane@example.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Location */}
              <View className="mb-4">
                <Text className="mb-2 font-medium text-neutral-800">City / Area</Text>
                <View className="flex-row items-center px-4 py-3 rounded-xl border bg-neutral-50 border-neutral-200">
                  <MapPin color="#525252" size={20} />
                  <TextInput
                    className="flex-1 ml-3 text-neutral-900"
                    placeholder="Colombo, Western"
                    placeholderTextColor="#9CA3AF"
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
              </View>

              {/* Password */}
              <View className="mb-4">
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
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff color="#6B7280" size={20} /> : <Eye color="#6B7280" size={20} />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View className="mb-5">
                <Text className="mb-2 font-medium text-neutral-800">Confirm Password</Text>
                <View className="flex-row items-center px-4 py-3 rounded-xl border bg-neutral-50 border-neutral-200">
                  <Lock color="#525252" size={20} />
                  <TextInput
                    className="flex-1 ml-3 text-neutral-900"
                    placeholder="Re-enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff color="#6B7280" size={20} /> : <Eye color="#6B7280" size={20} />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms */}
              <View className="flex-row items-start mb-6">
                <TouchableOpacity
                  className={`w-5 h-5 rounded mr-3 mt-1 items-center justify-center border-2 ${
                    agreeToTerms ? 'bg-red-600 border-red-600' : 'border-neutral-400'
                  }`}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                >
                  {agreeToTerms && <Text className="text-xs font-extrabold text-white">✓</Text>}
                </TouchableOpacity>
                <Text className="flex-1 text-neutral-600">
                  I agree to the{' '}
                  <Text className="font-semibold text-red-600">Terms</Text> and{' '}
                  <Text className="font-semibold text-red-600">Privacy Policy</Text>.
                </Text>
              </View>

              {/* Submit */}
              <TouchableOpacity
                className={`py-4 rounded-xl shadow-sm ${
                  agreeToTerms ? 'bg-red-600' : 'bg-neutral-300'
                }`}
                onPress={handleRegister}
                disabled={!agreeToTerms || isLoading}
                activeOpacity={0.9}
              >
                <Text
                  className={`text-center font-semibold text-lg ${
                    agreeToTerms ? 'text-white' : 'text-neutral-600'
                  }`}
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

            

            

              {/* Login link */}
              <View className="flex-row justify-center items-center mt-8">
                <Text className="text-neutral-600">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text className="font-semibold text-red-600">Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Benefits (news-flavored) */}
          <View className="px-6 py-8">
            <Text className="mb-4 text-xl font-extrabold text-center text-neutral-900">
              Why join <Text className="text-red-600">NewsNow</Text>?
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-center">
                <View className="justify-center items-center mr-4 w-8 h-8 bg-red-100 rounded-full">
                  <Text className="font-extrabold text-red-600">✓</Text>
                </View>
                <Text className="flex-1 text-neutral-700"> Personalized local & global news feed </Text>
              </View>

              <View className="flex-row items-center">
                <View className="justify-center items-center mr-4 w-8 h-8 bg-red-100 rounded-full">
                  <Text className="font-extrabold text-red-600">✓</Text>
                </View>
                <Text className="flex-1 text-neutral-700">Follow topics you care about</Text>
              </View>

              <View className="flex-row items-center">
                <View className="justify-center items-center mr-4 w-8 h-8 bg-red-100 rounded-full">
                  <Text className="font-extrabold text-red-600">✓</Text>
                </View>
                <Text className="flex-1 text-neutral-700">Comment & engage with the community</Text>
              </View>

              <View className="flex-row items-center">
                <View className="justify-center items-center mr-4 w-8 h-8 bg-red-100 rounded-full">
                  <Text className="font-extrabold text-red-600">✓</Text>
                </View>
                <Text className="flex-1 text-neutral-700">Breaking alerts in real-time</Text>
              </View>
            </View>
          </View>

          {/* Footer strip */}
          <View className="px-6 py-6 bg-black">
            <Text className="text-center text-white/70">© {new Date().getFullYear()} NewsNow</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;
