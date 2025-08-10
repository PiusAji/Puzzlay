import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Define image sizes for automatic generation
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150,
        crop: 'center', // Options: 'center', 'top', 'bottom', 'left', 'right', 'northwest', etc.
      },
      {
        name: 'card',
        width: 400,
        height: 300,
        crop: 'center',
      },
      {
        name: 'hero',
        width: 1200,
        height: 800,
        crop: 'center',
      },
      {
        name: 'logo',
        width: 200,
        height: 200,
        crop: 'center',
      },
      {
        name: 'avatar',
        width: 100,
        height: 100,
        crop: 'center',
      },
    ],
    // File type restrictions
    mimeTypes: ['image/*'],
  },
}
