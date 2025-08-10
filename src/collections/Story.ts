import { CollectionConfig, FieldHook } from 'payload'

interface PuzzleData {
  order: number
  title: string
  image?: string
}

const Story: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The main title of the story',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief description of the story that appears in the menu grid',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly version of the title',
      },
      hooks: {
        beforeValidate: [
          (({ data }) => {
            if (data?.title && !data?.slug) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return data?.slug
          }) as FieldHook,
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'puzzles',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 3,
      admin: {
        description: 'Exactly 3 puzzles that must be completed progressively',
      },
      fields: [
        {
          name: 'order',
          type: 'number',
          required: true,
          defaultValue: 1,
          min: 1,
          max: 3,
          admin: {
            description: 'Order of the puzzle (1, 2, or 3)',
            step: 1,
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Title of this specific puzzle',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Image that will be used as texture for the GLB model',
          },
        },
      ],
    },
    {
      name: 'totalCompletions',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Total number of users who completed this story',
        readOnly: true,
      },
    },
    {
      name: 'estimatedTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Estimated time to complete all puzzles (in minutes)',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Ensure puzzles are ordered correctly
        if (data?.puzzles) {
          data.puzzles = data.puzzles
            .sort((a: PuzzleData, b: PuzzleData) => a.order - b.order)
            .map((puzzle: PuzzleData, index: number) => ({
              ...puzzle,
              order: index + 1,
            }))
        }
        return data
      },
    ],
  },
}

export default Story
