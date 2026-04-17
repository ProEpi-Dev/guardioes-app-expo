import { ContextOption, LegalDocument } from '../types/register';
import { apiClient } from '../utils/api';

export const getRegisterData = async () => {
  const [contextsResponse, documentsResponse] = await Promise.all([
    apiClient('/v1/contexts'),
    apiClient('/v1/legal-documents/active'),
  ]);

  // Processar Contextos
  let contexts: ContextOption[] = [];
  const jsonContexts = contextsResponse.data;
  if (Array.isArray(jsonContexts)) {
    contexts = jsonContexts.map((ctx: any) => ({
      label: ctx.name,
      value: ctx.id,
      key: String(ctx.id),
    }));
  }

  // Processar Documentos
  let legalDocuments: LegalDocument[] = [];
  const jsonDocs = documentsResponse;
  if (Array.isArray(jsonDocs)) {
    legalDocuments = jsonDocs;
  }

  return { contexts, legalDocuments };
};
