import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true, // Allow public read access
  },
  admin: {
    group: 'Site Settings',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      label: 'Site Name',
      defaultValue: 'Puzzlay',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Site Logo',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO & Metadata',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Default Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Default Meta Description',
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Default Meta Image',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Default Keywords',
        },
      ],
    },
    {
      name: 'social',
      type: 'group',
      label: 'Social Media',
      fields: [
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter URL',
        },
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn URL',
        },
      ],
    },
  ],
}
