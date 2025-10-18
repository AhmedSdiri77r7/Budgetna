import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS_ADMIN: NbMenuItem[] = [
 /* {
    title: 'E-commerce',
    icon: 'shopping-cart-outline',
    link: '/pages/dashboard',
    home: true,
  },*/
  {
    title: 'Gestion Employe',
    icon: 'person-outline',
    link: '/pages/employe',
    home: true,
  },
  {
    title: 'Gestion Direction',
    icon: 'layers-outline',
    link: '/pages/direction',
    home: true,
  },
  {
    title: 'Gestion Entreprise',
    icon: 'home-outline',
    link: '/pages/entreprise',
    home: true,
  },
  {
    title: 'Gestion Compte Analytique',
    icon: 'layers-outline',
    link: '/pages/compte-analytique',
    home: true,
  },
  {
    title: 'Gestion Contrat',
    icon: 'file-text-outline',
    link: '/pages/contrat',
    home: true,
  },
  {
    title: 'IoT Dashboard',
    icon: 'activity-outline',
    link: '/pages/iot-dashboard',
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Gestion de Budget',
    icon: 'layout-outline',
    children: [
      {
        title: 'Profil',
        link: '/pages/layout/stepper',
      },
      {
        title: 'Liste Direction-Employe',
        link: '/pages/layout/list',
      },
      {
        title: 'Budget initial',
        link: '/pages/layout/infinite-list',
      },
      {
        title: 'Compte budgetaire',
        link: '/pages/layout/accordion',
      },
      {
        title: 'Budget',
        pathMatch: 'prefix',
        link: '/pages/layout/tabs',
      },
    ],
  },

  /*{
    title: 'Forms',
    icon: 'edit-2-outline',
    children: [
      {
        title: 'Form Inputs',
        link: '/pages/forms/inputs',
      },
      {
        title: 'Form Layouts',
        link: '/pages/forms/layouts',
      },
      {
        title: 'Buttons',
        link: '/pages/forms/buttons',
      },
      {
        title: 'Datepicker',
        link: '/pages/forms/datepicker',
      },
    ],
  },
  {
    title: 'UI Features',
    icon: 'keypad-outline',
    link: '/pages/ui-features',
    children: [
      {
        title: 'Grid',
        link: '/pages/ui-features/grid',
      },
      {
        title: 'Icons',
        link: '/pages/ui-features/icons',
      },
      {
        title: 'Typography',
        link: '/pages/ui-features/typography',
      },
      {
        title: 'Animated Searches',
        link: '/pages/ui-features/search-fields',
      },
    ],
  },
  {
    title: 'Modal & Overlays',
    icon: 'browser-outline',
    children: [
      {
        title: 'Dialog',
        link: '/pages/modal-overlays/dialog',
      },
      {
        title: 'Window',
        link: '/pages/modal-overlays/window',
      },
      {
        title: 'Popover',
        link: '/pages/modal-overlays/popover',
      },
      {
        title: 'Toastr',
        link: '/pages/modal-overlays/toastr',
      },
      {
        title: 'Tooltip',
        link: '/pages/modal-overlays/tooltip',
      },
    ],
  },
  {
    title: 'Extra Components',
    icon: 'message-circle-outline',
    children: [
      {
        title: 'Calendar',
        link: '/pages/extra-components/calendar',
      },
      {
        title: 'Progress Bar',
        link: '/pages/extra-components/progress-bar',
      },
      {
        title: 'Spinner',
        link: '/pages/extra-components/spinner',
      },
      {
        title: 'Alert',
        link: '/pages/extra-components/alert',
      },
      {
        title: 'Calendar Kit',
        link: '/pages/extra-components/calendar-kit',
      },
      {
        title: 'Chat',
        link: '/pages/extra-components/chat',
      },
    ],
  },
  
  {
    title: 'Statistique',
    icon: 'pie-chart-outline',
    children: [
     /*{
        title: 'Echarts',
        link: '/pages/charts/echarts',
      },
      {
        title: 'Charts.js',
        link: '/pages/charts/chartjs',
      },
     /* {
        title: 'D3',
        link: '/pages/charts/d3',
      },
    ],
  },  
  {
    title: 'Editors',
    icon: 'text-outline',
    children: [
      {
        title: 'TinyMCE',
        link: '/pages/editors/tinymce',
      },
      {
        title: 'CKEditor',
        link: '/pages/editors/ckeditor',
      },
    ],
  },*/
 /* {
    title: 'Gestion Compte Analytique',
    icon: 'grid-outline',
    children: [
      {
        title: 'users',
        link: '/pages/tables/smart-table',
      },
      {
        title: 'Compte analytique',
        link: '/pages/tables/tree-grid',
      },
    ],
  },*/
 /* {
    title: 'Miscellaneous',
    icon: 'shuffle-2-outline',
    children: [
      {
        title: '404',
        link: '/pages/miscellaneous/404',
      },
    ],
  },
*/
  
];
