import { Model, DataTypes } from 'sequelize';
import Specialist from '../models/specialist.model';
import { TimeSlot } from '../models/timeslot.model';
import { Op } from 'sequelize';
import type { SpecialistCreationAttributes } from '../models/specialist.model';

export class SpecialistService {
    // Get all specialists for a shop
    static async getAllByShop(shopId: string) {
        console.log('获取店铺专家列表:', { shopId });
        try {
            const specialists = await Specialist.findAll({
                where: { shopId },
                order: [['name', 'ASC']]
            });
            console.log('找到专家数量:', specialists.length);
            return specialists;
        } catch (error) {
            console.error('获取店铺专家列表失败:', error);
            throw error;
        }
    }

    // Get a specialist by ID
    static async getById(id: string) {
        console.log('根据ID获取专家:', { id });
        try {
            const specialist = await Specialist.findByPk(id);
            console.log('专家查询结果:', specialist ? '找到' : '未找到');
            return specialist;
        } catch (error) {
            console.error('根据ID获取专家失败:', error);
            throw error;
        }
    }

    // Create a new specialist
    static async create(data: SpecialistCreationAttributes) {
        console.log('创建新专家:', data);
        try {
            const specialist = await Specialist.create(data);
            console.log('专家创建成功:', { id: specialist.id });
            return specialist;
        } catch (error) {
            console.error('创建专家失败:', error);
            throw error;
        }
    }

    // Update a specialist
    static async update(id: string, data: Partial<SpecialistCreationAttributes>) {
        console.log('更新专家信息:', { id, data });
        try {
            const specialist = await Specialist.findByPk(id);
            if (!specialist) {
                console.log('未找到要更新的专家:', id);
                throw new Error('Specialist not found');
            }
            const updated = await specialist.update(data);
            console.log('专家信息更新成功:', { id });
            return updated;
        } catch (error) {
            console.error('更新专家信息失败:', error);
            throw error;
        }
    }

    // Delete a specialist
    static async delete(id: string) {
        console.log('删除专家:', { id });
        try {
            const specialist = await Specialist.findByPk(id);
            if (!specialist) {
                console.log('未找到要删除的专家:', id);
                throw new Error('Specialist not found');
            }
            await specialist.destroy();
            console.log('专家删除成功:', { id });
        } catch (error) {
            console.error('删除专家失败:', error);
            throw error;
        }
    }

    // Get available specialists for a specific date and time
    static async getAvailableSpecialists(shopId: string, date: string, startTime: string) {
        console.log('获取可用专家:', { shopId, date, startTime });
        try {
            // First, find all specialists in the shop
            const specialists = await Specialist.findAll({
                where: { 
                    shopId,
                    isAvailable: true
                }
            });
            console.log('找到店铺专家数量:', specialists.length);

            // Then, check their availability in time slots
            const availableSpecialists = [];
            for (const specialist of specialists) {
                const hasBooking = await TimeSlot.findOne({
                    where: {
                        specialistId: specialist.id,
                        date,
                        startTime,
                        isAvailable: false
                    }
                });

                if (!hasBooking) {
                    availableSpecialists.push(specialist);
                }
            }

            console.log('可用专家数量:', availableSpecialists.length);
            return availableSpecialists;
        } catch (error) {
            console.error('获取可用专家失败:', error);
            throw error;
        }
    }

    // Check if a specialist is available at a specific time
    static async isAvailable(specialistId: string, date: string, startTime: string) {
        console.log('检查专家是否可用:', { specialistId, date, startTime });
        try {
            const timeSlot = await TimeSlot.findOne({
                where: {
                    specialistId,
                    date,
                    startTime,
                    isAvailable: false
                }
            });

            const isAvailable = !timeSlot;
            console.log('专家可用性检查结果:', { specialistId, isAvailable });
            return isAvailable;
        } catch (error) {
            console.error('检查专家可用性失败:', error);
            throw error;
        }
    }
} 