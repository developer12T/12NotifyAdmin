<style scoped>
a:hover .icon {
  transform: scale(1.2);
  transition: transform 0.3s ease;
}

a:hover .icon-right {
  transform: translateX(10px);
  transition: transform 0.3s ease;
}

button:hover .icon {
}

.icon-right {
  transition: transform 0.3s ease;
}

.rotate-icon {
  transition: transform 0.3s ease;
}

.rotate-icon.rotate  {
  transform: rotate(90deg);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 30;
  transition: opacity 0.3s ease;
}

.overlay.hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
<template>
  <nav
      class="fixed top-0 z-50 w-full bg-gray-100 border-b shadow-md border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="px-3 py-2 lg:px-5 lg:pl-3">

      <div class="flex items-center justify-between">
        <div class="flex justify-start">
          <div class="text-center">
            <button v-if="activesTab === 'open'"
                @click="changeIconNavigate(activesTab === 'open' ? 'close' : 'open')"
                aria-controls="drawer-navigation"
                class="text-gray-400 bg-transparent mr-2 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm ml-[12px] p-1.5 top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-drawer-show="drawer-navigation" 
                data-drawer-target="drawer-navigation"
                type="button">
              <Icon :icon="activesTab === 'open' ? 'heroicons:x-mark-16-solid' : 'bi:list'" width="24" height="24"/>
            </button>

            <button v-if="activesTab === 'close'"
              @click="changeIconNavigate(activesTab === 'open' ? 'close' : 'open')"
              aria-controls="drawer-navigation"
              class="text-gray-400 bg-transparent mr-2 hover:bg-gray-200 hover:text-gray-900 rounded-lg ml-[12px] text-sm p-1.5 top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-drawer-hide="drawer-navigation"
              type="button">
              <Icon :icon="activesTab === 'open' ? 'heroicons:x-mark-16-solid' : 'bi:list'" width="24" height="24" />
         </button>
          </div>
          <div class="flex-row flex ml-2">
            <a class="flex items-center ml-7 mr-2" href="#">
             <img src="/logo-onetwo.png" alt="logo" class="w-auto h-10">
              <span
                  class="self-center text-sm font-semibold whitespace-nowrap dark:text-white"
              >ระบบจัดการ 12Chat</span
              >
            </a>
          </div>

        </div>
        <!-- <div class="flex items-center">
          <div class="flex items-center ml-3">
            <div>
              <button
                  aria-expanded="false"
                  class="flex text-sm rounded-full dark:focus:ring-gray-600"
                  data-dropdown-toggle="dropdown-user"
                  type="button"
              >
              <Icon icon="carbon:user-avatar-filled" width="32" height="32"  style="color: #000" />
              </button>
            </div>
            <div
                id="dropdown-user"
                class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
            >
              <div class="px-4 py-3" role="none">
                <span
                    class="block text-sm text-gray-900 dark:text-white text-center"
                >
              </span >
                <span
                    class="block text-sm text-gray-500 truncate dark:text-gray-400 text-center"
                >12Notification</span
                >
              </div>
              <ul class="py-1" role="none">
                <li>
                  <a
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      href="/logout"
                      role="menuitem"
                  >ออกจากระบบ</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </nav>


  <aside id="default-sidebar"
         aria-label="Sidebar"
         class="fixed top-0 left-0 z-40 w-20 h-screen transition-transform -translate-x-full sm:translate-x-0">
    <div class="h-full px-3 py-3 overflow-y-auto bg-gray-100 dark:bg-gray-800 ">
      <ul class="space-y-2 font-medium">
        <li>
          <div class="text-center align-middle">
            <button
                @click="changeIconNavigate(activesTab === 'open' ? 'close' : 'open')"
                aria-controls="drawer-navigation"
                class="inline-flex items-center ms-50 p-2  text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                data-drawer-show="drawer-navigation" data-drawer-target="drawer-navigation"
                :data-drawer-hide="activesTab === 'close' ? 'drawer-navigation' : undefined"
                type="button">
              <Icon :icon="activesTab === 'open' ? 'heroicons:x-mark-16-solid' : 'bi:list'" width="24" height="24"/>
            </button>
            
          </div>
        </li>
        <li class="mt-2">
          <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'dashboard',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'dashboard',
              }"
                       aria-current="page"
                       to="/dashboard"
                       @click="handlePage('dashboard')"
          >
          <Icon class="icon" icon="mdi:home" width="24" height="24" />
            <span style="font-size: 10px">หน้าหลัก</span></router-link>
        </li>

        <!--   test     -->
        <li>
          <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'announcement',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'announcement',
              }"
                       aria-current="page"
                       to="/announcement"
                       @click="handlePage('announcement')"
          >
          <Icon class="icon" icon="mdi:bell-notification" width="24" height="24" />
            <span style="font-size: 10px">ประกาศ</span></router-link>
          <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'chatGroup',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'chatGroup',
              }"
                       aria-current="page"
                       to="/chatGroup"
                       @click="handlePage('chatGroup')"
          >
          <Icon class="icon"  icon="ix:notification-filled" width="24" height="24"/>
            <span style="font-size: 10px">กลุ่ม</span></router-link>

            <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'employee',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'employee',
              }"
                       aria-current="page"
                       to="/employee"
                       @click="handlePage('employee')"
          >
          <Icon class="icon"  icon="clarity:employee-group-solid" width="24" height="24"/>
            <span style="font-size: 10px">พนักงาน</span></router-link>

          <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'develop',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'develop',
              }"
                       aria-current="page"
                       to="/develop"
                       @click="handlePage('develop')"
          >
          <Icon class="icon" icon="ph:code-fill" width="24" height="24" />
            <span style="font-size: 10px">develop</span></router-link>

            <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'profile',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'profile',
              }"
                       aria-current="page"
                       to="/profile"
                       @click="handlePage('profile')"
          >
              <Icon class="icon" icon="ph:user-list-fill" width="24" height="24" />
<!--          <Icon class="icon" icon="ph:code-fill" width="24" height="24" />-->
            <span style="font-size: 10px">โปรไฟล์</span></router-link>

            <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'logout',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'logout',
              }"
                       aria-current="page"
                       to="/logout"
                       @click="handlePage('logout')"
          >
              <Icon class="icon" icon="basil:logout-solid" style="color: red" width="24" height="24" />
<!--          <Icon class="icon" icon="ph:code-fill" width="24" height="24" />-->
            <span style="font-size: 10px;color: red">logout</span></router-link>
        </li>
      </ul>
    </div>
  </aside>

  <!--  full sidebar-->
  <div
    id="drawer-navigation"
    aria-labelledby="drawer-navigation-label"
    :class="[
      'fixed top-0 left-0 pt-2 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform duration-300  bg-gray-100 dark:bg-gray-800',
      activesTab === 'open' ? 'translate-x-0' : '-translate-x-full'
    ]"
    tabindex="-1"
  >
    <div class="flex flex-row pt-0">
      <button
        @click="changeIconNavigate(activesTab === 'open' ? 'close' : 'open')"
        aria-controls="drawer-navigation"
        class="text-gray-400 bg-transparent mr-2 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        data-drawer-hide="drawer-navigation"
        type="button">
        <Icon :icon="activesTab === 'open' ? 'heroicons:x-mark-16-solid' : 'bi:list'" width="28" height="28" />
      </button>
    </div>
    <div class="py-4 overflow-y-auto flex flex-col ">
      <ul class="space-y-2 font-medium">
        <li>
          <router-link   :class="{
                'flex items-center p-2  group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'dashboard',
                'flex items-center p-2  group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'dashboard',
              }"
                       aria-current="page"
                       to="/dashboard"
                       @click="handlePage('dashboard')"
          >
          <Icon class="icon-right" icon="mdi:home" width="24" height="24" />
            <!-- <Icon class="icon-right" height="24" icon="tabler:home" width="24"/> -->
            <span class="ml-3 icon-right">หน้าหลัก</span></router-link>
        </li>
        <!--        test -->
        <li>
          <router-link :class="{
                'flex items-center p-2  group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'announcement',
                'flex items-center p-2  group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'announcement',
              }"
                       aria-current="page"
                       to="/announcement"
                       @click="handlePage('announcement')"
          >
          <Icon class="icon-right" icon="mdi:bell-notification" width="24" height="24" />
            <span class="ml-3 icon-right">ประกาศ-ส่งแจ้งเตือน</span></router-link>
          <router-link :class="{
                'flex items-center p-2  group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'chatGroup',
                'flex items-center p-2  group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'chatGroup',
              }"
                       aria-current="page"
                       to="/chatGroup"
                       @click="handlePage('chatGroup')"
          >
          <Icon class="icon-right"  icon="ix:notification-filled" width="24" height="24"/>
            <span class="ml-3 icon-right">กลุ่ม-ห้องแชท</span></router-link>

            <router-link :class="{
                'flex items-center p-2  group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'employee',
                'flex items-center p-2  group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'employee',
              }"
                       aria-current="page"
                       to="/employee"
                       @click="handlePage('employee')"
          >
          <Icon class="icon-right"  icon="clarity:employee-group-solid" width="24" height="24"/>
            <span class="ml-3 icon-right">ข้อมูลพนักงาน</span></router-link>

          <router-link :class="{
                'flex items-center p-2  group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'develop',
                'flex items-center p-2  group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'develop',
              }"
                       aria-current="page"
                       to="/develop"
                       @click="handlePage('develop')"
          >
          <Icon class="icon-right" icon="ph:code-fill" width="24" height="24" />
            <span class="ml-3 icon-right">developer-mode</span></router-link>

            <router-link :class="{
                  'flex items-center p-2  group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                    pageName === 'profile',
                  'flex items-center p-2  group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                    pageName !== 'profile',
                }"
                        aria-current="page"
                        to="/profile"
                        @click="handlePage('profile')"
            >
            <Icon class="icon-right" icon="ph:user-list-fill" width="24" height="24" />
              <span class="ml-3 icon-right">ข้อมูลส่วนตัว</span></router-link>

              <router-link :class="{
                    'flex items-center p-2  group text-[#00569D] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                    pageName === 'logout',
                  'flex items-center p-2  group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                    pageName !== 'logout',
                }"
                        aria-current="page"
                        to="/logout"
                        @click="handlePage('logout')"
          >
          <Icon class="icon-right" icon="basil:logout-solid" style="color: red" width="24" height="24" />
            <span class="ml-3 icon-right" style="color: red">ออกจากระบบ</span></router-link>
        </li>

      </ul>
    </div>
  </div>

<footer :class="[
  'fixed bottom-0 bg-none dark:bg-gray-800 z-30 ml-2 transition-all duration-300',
  // 'fixed bottom-0 bg-[#F3F4F6] rounded-lg shadow-sm dark:bg-gray-800 z-30 ml-2 transition-all duration-300',
  activesTab === 'open' ? 'left-64 right-4' : 'left-20 right-4'
]">
    <div class="w-full mx-auto p-4">
   
        <div class="flex items-center justify-start space-x-2">
              <img src="/logo-fplus.png" alt="logo" class="h-4 object-contain" />
              <span class="text-xs text-gray-500 dark:text-gray-400">
                Copyright One Two Trading Co., Ltd. All rights reserved.
              </span>
            </div>
    </div>
</footer>

<!-- Add padding to main content to prevent footer overlap -->
<div :class="[
  'transition-all duration-300',
  activesTab === 'open' ? 'ml-64' : 'ml-20'
]">
</div>

  <!-- Add overlay div -->
  <div 
    :class="[
      'overlay',
      activesTab === 'open' ? '' : 'hidden'
    ]"
    @click="changeIconNavigate('close')"
  ></div>
</template>

<script>
import {onMounted, ref,computed} from "vue";
import {initCollapses, initDrawers} from "flowbite";
import {Icon} from '@iconify/vue';
import {usePageStore} from '@/stores'

export default {
  components: {
    Icon
  },
  setup() {
    const pageStore = usePageStore();
    const pageName = ref("dashboard");

    const activesIcon = ref('up')
    const activesTab = ref('close')

    // const pageName2 = JSON.parse(localStorage.getItem("pocoPage"))

    onMounted(() => {
      initCollapses();
      initDrawers();
    });

   const pageName2 = localStorage.getItem("pocoPage" || '')
    if(pageName2 === null){

    }else{
      pageName.value = pageName2
    }
    const handlePage = async (pageNames) => {
      pageName.value = pageNames;
      pageStore.setPage(pageNames);
      // console.log('store page : '+pageStore.currentPage)
      // console.log("tabs value after click:", pageName.value);
    };

    const rotate = (act) => {
      if(act === 'down'){
        activesIcon.value = 'up'
      }else if(act === 'up'){
        activesIcon.value = 'down'
      }
    }

    const changeIconNavigate = (act) => {
      console.log(act)
      if(act === 'open'){
        activesTab.value = 'open'
      }else if(act === 'close'){
        activesTab.value = 'close'
      }
    }


    return {
      changeIconNavigate,
      activesIcon,
      activesTab,
      pageName,
      handlePage,
      rotate
    }
  },
};
</script>
