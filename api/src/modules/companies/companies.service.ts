import { companiesRepository } from './companies.repository';
import type { CompanyDto } from './companies.dto';

export const companiesService = {
  async findById(id: string): Promise<CompanyDto | null> {
    const company = await companiesRepository.findById(id);
    if (!company) return null;
    const { password: _pw, ...rest } = company;
    void _pw;
    return rest;
  },
};
