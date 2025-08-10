import type { CollectionConfig } from 'payload'

export const Nav: CollectionConfig = {
  slug: 'nav',
  admin: {
    useAsTitle: 'title',
    group: 'Site Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Navigation Title',
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Items',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Link Label',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          admin: {
            description: 'Leave empty if this item has sublinks only',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Open in New Tab',
          defaultValue: false,
        },
        {
          name: 'subItems',
          type: 'array',
          label: 'Sub Navigation Items',
          admin: {
            description: 'Add dropdown/submenu items',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Sub Link Label',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'Sub URL',
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              label: 'Open in New Tab',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
}
