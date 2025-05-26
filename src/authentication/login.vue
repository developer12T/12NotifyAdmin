<template>
  <section class="bg-gray-100 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
    <!-- <BaseAlert
    :show="showError"
    title="เข้าสู่ระบบไม่สำเร็จ"
    message="รหัสผ่านหรือชื่อผู้ใช้งานผิด"
    :show-view-more="false"
    type="danger"
    @dismiss="showError = false"
  /> -->
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
      <div class="flex justify-center">
                    <div class="flex items-center">
                        <img class="h-21 mr-2 sm:w-32 md:w-60" src="/logo-onetwo.png" alt="logo" />
                    </div>
                </div>
        <div class="p-6 space-y-4 md:space-y-6 sm:p-6" style="padding-top: 0%">
          <form
            class="space-y-4 md:space-y-6"
            @submit.prevent="SignIn"
            method="post"
          >
            <div>
              <label
                for="text"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >ชื่อผู้ใช้งาน <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                v-model="userLogin"
                id="userLogin"
                :class="[
                  'bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                  userLoginError ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="กรุณากรอกชื่อผู้ใช้งาน"
                
                @input="validateUserLogin"
              />
              <p v-if="userLoginError" class="mt-1 text-sm text-red-500">{{ userLoginError }}</p>
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >รหัสผ่าน <span class="text-red-500">*</span></label
              >
              <input
                type="password"
                v-model="passwordLogin"
                id="passwordLogin"
                placeholder="••••••••"
                :class="[
                  'bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                  passwordError ? 'border-red-500' : 'border-gray-300'
                ]"
                
                @input="validatePassword"
              />
              <p v-if="passwordError" class="mt-1 text-sm text-red-500">{{ passwordError }}</p>
            </div>
            <button
              style="border-radius: 12px; background-color: #00569D"
              type="submit"
              class="w-full text-white bg-blue-700 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import {onMounted, ref} from 'vue';
import { useRouter } from "vue-router";
import {useAuthStore} from '@/stores';
// import {BaseAlert} from '@/components/alerts';
import Swal from 'sweetalert2';

export default {
  components: {
    // BaseAlert
  },
  setup() {
    const userLogin = ref('');
    const passwordLogin = ref('');
    const userLoginError = ref('');
    const passwordError = ref('');
    const showError = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();

    // Check if user is already logged in
    onMounted(() => {
      if (authStore.isLoggedIn) {
        router.push('/dashboard');
      }
    });

    const validateUserLogin = () => {
      if (!userLogin.value) {
        userLoginError.value = 'กรุณากรอกชื่อผู้ใช้งาน';
      } else {
        userLoginError.value = '';
      }
    };

    const validatePassword = () => {
      if (!passwordLogin.value) {
        passwordError.value = 'กรุณากรอกรหัสผ่าน';
      } else {
        passwordError.value = '';
      }
    };

    const SignIn = async () => {
      validateUserLogin();
      validatePassword();
      
      if (userLoginError.value || passwordError.value) {
        return;
      }

      try {
        const response = await authStore.login(userLogin.value, passwordLogin.value);
        
        if (response.status === 200 && response.data && response.data[0]) {
          const userData = response.data[0];
          
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', JSON.stringify(response.token));
          
          // Show success message with Thai name if available
          await Swal.fire({
            icon: 'success',
            title: 'เข้าสู่ระบบสำเร็จ',
            text: `ยินดีต้อนรับ ${userData.fullNameThai || userData.fullName}`,
            timer: 1500,
            showConfirmButton: false
          });

          // Redirect to dashboard
          await router.push('/dashboard');
        } else {
          throw new Error('เข้าสู่ระบบไม่สำเร็จ');
        }
      } catch (error) {
        console.error('Login error:', error);
        Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          text: error.message || 'รหัสผ่านหรือชื่อผู้ใช้งานผิด',
        });
      }
    };

    return {
      userLogin,
      passwordLogin,
      userLoginError,
      passwordError,
      showError,
      SignIn,
      validateUserLogin,
      validatePassword,
    };
  },
};
</script>

<style scoped>
.invalid-input {
  border: 1px solid red;
  box-shadow: 0 0 2px red;
}
</style>
