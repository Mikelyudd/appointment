import { Request, Response } from 'express';
import { Appointment, TimeSlot, Service, Specialist, Shop, Verification } from '../models';
import { Op } from 'sequelize';
import moment from 'moment';
import { formatPhoneNumber } from '../utils/verification';

export const verifyAndCreateAppointment = async (req: Request, res: Response) => {
    console.log('=== verifyAndCreateAppointment start ===');
    console.log('Request body:', req.body);
    
    try {
        const { 
            phone: rawPhone, 
            code, 
            serviceId, 
            specialistId,
            shopId,
            timeSlotId,
            customerName,
            customerPhone,
            customerEmail,
            notes 
        } = req.body;

        // 检查必填字段
        const requiredFields = {
            rawPhone,
            code,
            serviceId,
            specialistId,
            shopId,
            timeSlotId
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([field]) => field);

        if (missingFields.length > 0) {
            console.log('Missing required fields:', missingFields);
            return res.status(400).json({ 
                message: 'Missing required fields',
                details: {
                    missingFields,
                    receivedFields: Object.keys(req.body)
                }
            });
        }

        // 格式化手机号码
        const phone = formatPhoneNumber(rawPhone);
        console.log('Formatted phone number:', phone);

        // 验证时间段是否可用
        console.log('Checking time slot availability:', timeSlotId);
        const timeSlot = await TimeSlot.findOne({
            where: {
                id: timeSlotId,
                isAvailable: true
            }
        });

        if (!timeSlot) {
            console.log('Time slot not available:', timeSlotId);
            return res.status(400).json({ message: 'Time slot is not available' });
        }

        // 检查时间是否已过
        const slotDateTime = moment(`${timeSlot.date} ${timeSlot.startTime}`, 'YYYY-MM-DD HH:mm');
        if (slotDateTime.isBefore(moment())) {
            console.log('Time slot has passed:', timeSlotId);
            return res.status(400).json({ message: 'Time slot has passed' });
        }

        // 验证验证码
        console.log('Checking verification code:', { phone, code });
        const verification = await Verification.findOne({
            where: {
                phone,
                code,
                createdAt: {
                    [Op.gt]: new Date(Date.now() - 5 * 60 * 1000) // 5分钟内
                }
            },
            order: [['createdAt', 'DESC']]
        });

        if (!verification) {
            console.log('Invalid verification code for phone:', phone);
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // 验证服务和专家是否存在
        console.log('Checking service and specialist:', { serviceId, specialistId });
        const [service, specialist] = await Promise.all([
            Service.findByPk(serviceId),
            Specialist.findByPk(specialistId)
        ]);

        if (!service || !specialist) {
            console.log('Service or specialist not found:', {
                serviceFound: !!service,
                specialistFound: !!specialist
            });
            return res.status(400).json({ message: 'Service or specialist not found' });
        }

        // 创建预约
        console.log('Creating appointment');
        const appointment = await Appointment.create({
            serviceId,
            specialistId,
            shopId,
            timeSlotId,
            customerName: customerName || 'Guest',
            customerPhone: customerPhone || phone,
            customerEmail,
            notes,
            status: 'confirmed',
            date: timeSlot.date,
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime
        });

        console.log('Appointment created:', appointment.toJSON());

        // 标记时间段为不可用
        console.log('Updating time slot availability');
        await timeSlot.update({ isAvailable: false });

        console.log('Appointment creation successful');
        res.json({
            message: 'Appointment created successfully',
            appointment
        });
    } catch (error: any) {
        console.error('Error creating appointment:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            message: 'Failed to create appointment',
            error: error.message
        });
    } finally {
        console.log('=== verifyAndCreateAppointment end ===');
    }
};

// 获取用户预约列表
export const getUserAppointments = async (req: Request, res: Response) => {
    console.log('=== getUserAppointments start ===');
    console.log('Request query:', req.query);
    console.log('Request user:', req.user);
    
    try {
        const { phone } = req.query;
        
        if (!phone) {
            return res.status(400).json({ message: '缺少电话号码参数' });
        }

        const appointments = await Appointment.findAll({
            where: {
                customerPhone: phone
            },
            include: [
                {
                    model: Shop,
                    as: 'shop'
                },
                {
                    model: TimeSlot,
                    as: 'timeSlot'
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return res.json(appointments);
    } catch (error) {
        console.error('获取预约失败:', error);
        return res.status(500).json({ message: '获取预约失败' });
    }
};
