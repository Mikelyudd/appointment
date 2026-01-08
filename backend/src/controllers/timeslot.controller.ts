import { Request, Response } from 'express';
import { TimeSlot, Shop } from '../models';
import { TimeOfDay } from '../models/timeslot.model';
import moment from 'moment';
import { Op } from 'sequelize';

interface GroupedTimeSlots {
    morning: TimeSlot[];
    afternoon: TimeSlot[];
    evening: TimeSlot[];
}

export class TimeSlotController {
    static async generate(req: Request, res: Response) {
        try {
            const { shopId, specialistId, date } = req.body;
            console.log('生成时间段请求:', { shopId, specialistId, date });

            // 验证必需参数
            if (!shopId || !date) {
                return res.status(400).json({ error: '店铺ID和日期是必需的' });
            }

            // 获取店铺信息和营业时间
            const shop = await Shop.findByPk(shopId);
            if (!shop) {
                return res.status(404).json({ error: '店铺不存在' });
            }

            // 获取当前时间
            const now = moment();
            const targetDate = moment(date);
            
            // 如果日期已过，返回错误
            if (targetDate.isBefore(now, 'day')) {
                return res.status(400).json({ error: '不能选择过去的日期' });
            }

            // 获取营业时间
            const dayOfWeek = targetDate.format('dddd').toLowerCase() as keyof typeof shop.workingHours;
            const workingHours = shop.workingHours[dayOfWeek];
            if (!workingHours || !workingHours.isOpen) {
                return res.status(400).json({ error: '该日期不营业' });
            }

            // 解析营业时间
            const openTime = moment(date + ' ' + workingHours.start);
            const closeTime = moment(date + ' ' + workingHours.end);

            // 如果是当天，从下一个可用的时间段开始
            let startTime = openTime;
            if (targetDate.isSame(now, 'day')) {
                // 预留30分钟准备时间
                startTime = moment().add(30, 'minutes').startOf('hour');
                if (startTime.isAfter(closeTime)) {
                    return res.status(400).json({ error: '今天的预约时间已结束' });
                }
            }

            // 生成时间段（每小时一个时间段）
            const timeSlots = [];
            let currentTime = startTime;

            while (currentTime.isBefore(closeTime)) {
                // 确定时间段类型
                let timeOfDay: TimeOfDay = 'morning';
                const hour = currentTime.hour();
                if (hour >= 12 && hour < 17) {
                    timeOfDay = 'afternoon';
                } else if (hour >= 17) {
                    timeOfDay = 'evening';
                }

                timeSlots.push({
                    shopId,
                    specialistId: specialistId || null,
                    date: currentTime.format('YYYY-MM-DD'),
                    startTime: currentTime.format('HH:mm'),
                    endTime: moment(currentTime).add(1, 'hour').format('HH:mm'),
                    isAvailable: true,
                    timeOfDay
                });

                currentTime.add(1, 'hour');
            }

            if (timeSlots.length === 0) {
                return res.status(400).json({ error: '没有可用的时间段' });
            }

            // 创建时间段
            const createdSlots = await TimeSlot.bulkCreate(timeSlots);
            console.log(`成功生成 ${createdSlots.length} 个时间段`);

            // 按时段分组返回
            const groupedSlots: GroupedTimeSlots = {
                morning: createdSlots.filter(slot => slot.timeOfDay === 'morning'),
                afternoon: createdSlots.filter(slot => slot.timeOfDay === 'afternoon'),
                evening: createdSlots.filter(slot => slot.timeOfDay === 'evening')
            };

            res.status(201).json(groupedSlots);
        } catch (error) {
            console.error('生成时间段失败:', error);
            res.status(500).json({ error: '生成时间段失败' });
        }
    }

    static async getAvailable(req: Request, res: Response) {
        try {
            const { shopId, date, specialistId } = req.query;

            if (!shopId || !date) {
                return res.status(400).json({ error: '店铺ID和日期是必需的' });
            }

            // 获取当前时间
            const now = moment();
            const targetDate = moment(date as string);

            // 如果日期已过，返回错误
            if (targetDate.isBefore(now, 'day')) {
                return res.status(400).json({ error: '不能选择过去的日期' });
            }

            // 构建查询条件
            const where: any = {
                shopId,
                date: targetDate.format('YYYY-MM-DD'),
            };

            // 如果是当天，只返回未来的时间段
            if (targetDate.isSame(now, 'day')) {
                where.startTime = {
                    [Op.gt]: moment().add(30, 'minutes').format('HH:mm')
                };
            }

            // 如果指定了专家，添加专家条件
            if (specialistId) {
                where.specialistId = specialistId;
            }

            // 获取所有时间段，包括不可用的
            const timeSlots = await TimeSlot.findAll({
                where,
                order: [
                    ['date', 'ASC'],
                    ['startTime', 'ASC']
                ]
            });

            // 按时段分组
            const groupedSlots: GroupedTimeSlots = {
                morning: timeSlots.filter(slot => slot.timeOfDay === 'morning'),
                afternoon: timeSlots.filter(slot => slot.timeOfDay === 'afternoon'),
                evening: timeSlots.filter(slot => slot.timeOfDay === 'evening')
            };

            res.json(groupedSlots);
        } catch (error) {
            console.error('获取可用时间段失败:', error);
            res.status(500).json({ error: '获取可用时间段失败' });
        }
    }

    // 更新时间段状态
    static async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { isAvailable } = req.body;

            const timeSlot = await TimeSlot.findByPk(id);
            if (!timeSlot) {
                res.status(404).json({ error: 'Time slot not found' });
                return;
            }

            await timeSlot.update({ isAvailable });
            res.json(timeSlot);
        } catch (error) {
            console.error('Error updating time slot:', error);
            res.status(500).json({ error: 'Error updating time slot' });
        }
    }
}
