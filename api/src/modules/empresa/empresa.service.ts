import { companiesRepository } from '@modules/companies/companies.repository';
import { NotFoundError } from '@shared/errors/HttpError';

export interface UpdateProfileInput {
  name?: string;
  phone?: string | null;
  cnpj_cpf?: string | null;
  logo_url?: string | null;
}

export const empresaService = {
  async getProfile(companyId: string) {
    const company = await companiesRepository.findById(companyId);
    if (!company) throw new NotFoundError('Empresa');
    const { password: _pw, ...rest } = company;
    void _pw;
    return rest;
  },

  async updateProfile(companyId: string, input: UpdateProfileInput) {
    const company = await companiesRepository.findById(companyId);
    if (!company) throw new NotFoundError('Empresa');
    const updated = await companiesRepository.update(companyId, input);
    const { password: _pw, ...rest } = updated;
    void _pw;
    return rest;
  },
};
