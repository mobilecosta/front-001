/**
 * Serviço de Categorias
 */

import type { CreateCategoriaDto, UpdateCategoriaDto } from '../dtos/categoria.dto';
import type { PaginatedResponse } from '../types/po-ui.types';
import {
  createPaginatedResponse,
  calculateOffset,
  validatePaginationParams,
} from '../utils/po-ui.response';

export class CategoriaService {
  /**
   * Listar categorias com paginação
   */
  async listCategorias(
    tenantId: string,
    tipo?: 'receita' | 'despesa',
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<any>> {
    const { page: validPage, pageSize: validPageSize } =
      validatePaginationParams(page, pageSize);
    const offset = calculateOffset(validPage, validPageSize);

    // TODO: Implementar query ao banco de dados
    // const query = `SELECT * FROM categorias WHERE tenant_id = $1 AND ativo = true`;
    // const params: any[] = [tenantId];
    //
    // if (tipo) {
    //   query += ` AND tipo = $${params.length + 1}`;
    //   params.push(tipo);
    // }
    //
    // query += ` ORDER BY criado_em DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    // params.push(validPageSize, offset);
    //
    // const categorias = await db.query(query, params);

    const categorias: any[] = [];
    const totalRecords = 0;

    return createPaginatedResponse(categorias, validPage, validPageSize, totalRecords);
  }

  /**
   * Obter categoria por ID
   */
  async getCategoriaById(tenantId: string, categoriaId: string): Promise<any> {
    // TODO: Implementar query ao banco de dados
    return null;
  }

  /**
   * Criar nova categoria
   */
  async createCategoria(tenantId: string, dto: CreateCategoriaDto): Promise<any> {
    // TODO: Implementar insert ao banco de dados
    return {
      id: 'new-id',
      tenantId,
      ...dto,
      ativo: true,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };
  }

  /**
   * Atualizar categoria
   */
  async updateCategoria(
    tenantId: string,
    categoriaId: string,
    dto: UpdateCategoriaDto
  ): Promise<any> {
    // TODO: Implementar update ao banco de dados
    return null;
  }

  /**
   * Deletar categoria
   */
  async deleteCategoria(tenantId: string, categoriaId: string): Promise<boolean> {
    // TODO: Implementar delete ao banco de dados
    return true;
  }

  /**
   * Obter categorias padrão por tipo
   */
  async getDefaultCategories(tipo: 'receita' | 'despesa'): Promise<any[]> {
    const defaultCategories = {
      receita: [
        { nome: 'Salário', icone: 'money', cor: '#4CAF50' },
        { nome: 'Freelance', icone: 'work', cor: '#2196F3' },
        { nome: 'Investimentos', icone: 'trending-up', cor: '#FF9800' },
        { nome: 'Outros', icone: 'more-horiz', cor: '#9C27B0' },
      ],
      despesa: [
        { nome: 'Alimentação', icone: 'restaurant', cor: '#F44336' },
        { nome: 'Transporte', icone: 'directions-car', cor: '#00BCD4' },
        { nome: 'Moradia', icone: 'home', cor: '#795548' },
        { nome: 'Educação', icone: 'school', cor: '#673AB7' },
        { nome: 'Saúde', icone: 'favorite', cor: '#E91E63' },
        { nome: 'Entretenimento', icone: 'theaters', cor: '#FF5722' },
        { nome: 'Utilidades', icone: 'lightbulb', cor: '#FFC107' },
        { nome: 'Outros', icone: 'more-horiz', cor: '#9C27B0' },
      ],
    };

    return defaultCategories[tipo] || [];
  }
}

export const categoriaService = new CategoriaService();
