import { sequelize } from '../config/database';
import Shop from '../models/shop.model';
import Service from '../models/service.model';
import { Specialist } from '../models/specialist.model';
import { TimeSlot } from '../models/timeslot.model';
import moment from 'moment';

type TimeOfDay = 'morning' | 'afternoon' | 'evening';

async function seedDatabase() {
    try {
        // 只重建特定的表
        await Shop.sync({ force: true });
        await Service.sync({ force: true });
        await Specialist.sync({ force: true });
        await TimeSlot.sync({ force: true });

        // Create shop
        const shop = await Shop.create({
            id: 'aec0c125-1c74-487f-8b6d-4ce0125384a2',
            name: "Beauty & Wellness Spa",
            address: "123 Main Street",
            phone: "123-456-7890",
            workingHours: {
                monday: { isOpen: true, start: '09:00', end: '20:00' },
                tuesday: { isOpen: true, start: '09:00', end: '20:00' },
                wednesday: { isOpen: true, start: '09:00', end: '20:00' },
                thursday: { isOpen: true, start: '09:00', end: '20:00' },
                friday: { isOpen: true, start: '09:00', end: '20:00' },
                saturday: { isOpen: true, start: '09:00', end: '20:00' },
                sunday: { isOpen: true, start: '09:00', end: '20:00' }
            }
        });

        // Create services
        const services = await Service.bulkCreate([
            {
                shopId: shop.id,
                name: "Meridian's Set",
                description: "This treatment promotes blood circulation, clears waste from the meridians, and balances 'qi' and blood.",
                duration: 60,
                price: 89.99,
                category: "Body Treatment"
            },
            {
                shopId: shop.id,
                name: "Breast Care Treatment",
                description: "Soothes the liver, regulates qi and emotions, clears breast meridians, promotes circulation.",
                duration: 60,
                price: 99.99,
                category: "Body Treatment"
            }
        ]);

        // Create specialists
        const specialists = await Specialist.bulkCreate([
            {
                shopId: shop.id,
                name: "Sarah Johnson",
                code: "S1",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                isAvailable: true
            },
            {
                shopId: shop.id,
                name: "Michael Chen",
                code: "S2",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
                isAvailable: true
            },
            {
                shopId: shop.id,
                name: "Emma Davis",
                code: "S3",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
                isAvailable: true
            }
        ]);

        // Create time slots for the next 7 days
        const timeSlots = [];
        const startDate = moment();
        const endDate = moment().add(7, 'days');

        for (const specialist of specialists) {
            let currentDate = startDate.clone();
            while (currentDate.isBefore(endDate)) {
                const date = currentDate.format('YYYY-MM-DD');
                const workingHours = shop.workingHours[currentDate.format('dddd').toLowerCase() as keyof typeof shop.workingHours];

                if (workingHours.isOpen) {
                    const startTime = moment(workingHours.start, 'HH:mm');
                    const endTime = moment(workingHours.end, 'HH:mm');

                    while (startTime.isBefore(endTime)) {
                        const currentTime = startTime.format('HH:mm');
                        const nextTime = startTime.clone().add(15, 'minutes').format('HH:mm');
                        const timeOfDay = (() => {
                            const hour = startTime.hour();
                            if (hour < 12) return 'morning' as TimeOfDay;
                            if (hour < 17) return 'afternoon' as TimeOfDay;
                            return 'evening' as TimeOfDay;
                        })();

                        timeSlots.push({
                            shopId: shop.id,
                            specialistId: specialist.id,
                            date,
                            startTime: currentTime,
                            endTime: nextTime,
                            isAvailable: true,
                            timeOfDay
                        });

                        startTime.add(15, 'minutes');
                    }
                }

                currentDate.add(1, 'day');
            }
        }

        await TimeSlot.bulkCreate(timeSlots);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await sequelize.close();
    }
}

seedDatabase(); 