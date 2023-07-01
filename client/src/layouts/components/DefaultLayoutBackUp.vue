<template #vertical-nav-content>
  <VerticalNavLink
    :item="{
      title: 'Dashboard',
      icon: 'bx-home',
      to: '/dashboard',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Account Settings',
      icon: 'mdi-account-cog-outline',
      to: '/account-settings',
    }"
  />

  <!-- 👉 Pages -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Pages',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Login',
      icon: 'bx-log-in',
      to: '/login',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Register',
      icon: 'bx-user-plus',
      to: '/register',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Error',
      icon: 'bx-info-circle',
      to: '/no-existence',
    }"
  />

  <!-- 👉 User Interface -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'User Interface',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Typography',
      icon: 'mdi-alpha-t-box-outline',
      to: '/typography',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Icons',
      icon: 'bx-show',
      to: '/icons',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Cards',
      icon: 'bx-credit-card',
      to: '/cards',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Tables',
      icon: 'bx-table',
      to: '/tables',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Form Layouts',
      icon: 'mdi-form-select',
      to: '/form-layouts',
    }"
  />
</template>

