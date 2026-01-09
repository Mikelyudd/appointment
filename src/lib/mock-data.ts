export interface Staff {
  id: string;
  name: string;
  title: string;
  avatar: string;
  available: boolean;
}

export const mockApi = {
  getStaff: async (): Promise<Staff[]> => {
    return [
      {
        id: '1',
        name: 'Sarah Chen',
        title: 'Senior Therapist',
        avatar: '/avatars/sarah.jpg',
        available: true
      },
      {
        id: '2',
        name: 'Lisa Wang',
        title: 'Massage Therapist',
        avatar: '/avatars/lisa.jpg',
        available: true
      },
      {
        id: '3',
        name: 'Mary Zhang',
        title: 'Beauty Specialist',
        avatar: '/avatars/mary.jpg',
        available: true
      },
      {
        id: '4',
        name: 'Jenny Liu',
        title: 'Senior Therapist',
        avatar: '/avatars/jenny.jpg',
        available: false
      }
    ];
  },

  getAvailableTimeSlots: async (date: Date): Promise<string[]> => {
    // 模拟不同日期有不同的可用时间段
    const slots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30'
    ];

    // 随机返回一些时间段作为可用时间
    return slots.filter(() => Math.random() > 0.3);
  }
};

export const mockServices = [
  {
    id: '1',
    name: "Meridian's Set",
    description: "This treatment promotes blood circulation, clears waste from the meridians, and balances 'qi' and blood.",
    duration: 60,
    price: 89.99
  },
  {
    id: '2',
    name: 'Breast Care Treatment',
    description: 'Soothes the liver, regulates qi and emotions, clears breast meridians, promotes circulation.',
    duration: 60,
    price: 99.99
  }
];

export const mockTimeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
]; 