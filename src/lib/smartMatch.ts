import { Property, ClientProfile, SmartMatchResult } from '../types';

/**
 * Intelligent Client-Centric Matching Engine
 * Inverts traditional cold real-estate filters by analyzing lifestyle, life stage,
 * household size, mobility, and natural language intent.
 */
export function calculateSmartMatches(
  properties: Property[],
  profile: ClientProfile
): {
  results: SmartMatchResult[];
  personalizedSummary: string;
} {
  const published = properties.filter((p) => p.published);
  if (published.length === 0) {
    return {
      results: [],
      personalizedSummary: 'Nenhum imóvel disponível no momento.',
    };
  }

  const query = (profile.freeTextQuery || '').toLowerCase().trim();
  const isStudent =
    profile.isStudent === true ||
    profile.lifeStage === 'estudante' ||
    query.includes('estudante') ||
    query.includes('faculdade') ||
    query.includes('universidade') ||
    query.includes('usp') ||
    query.includes('puc') ||
    query.includes('mackenzie') ||
    query.includes('republica') ||
    query.includes('dividir com amigo') ||
    query.includes('estágio');

  const isFamily =
    profile.lifeStage === 'familia' ||
    profile.peopleCount === 'familia' ||
    profile.peopleCount === '5+' ||
    query.includes('família') ||
    query.includes('familia') ||
    query.includes('filho') ||
    query.includes('filhos') ||
    query.includes('criança') ||
    query.includes('escola');

  const isCoupleOrSolo =
    profile.peopleCount === '1-2' ||
    profile.lifeStage === 'casal' ||
    profile.lifeStage === 'jovem_profissional' ||
    query.includes('casal') ||
    query.includes('sozinho') ||
    query.includes('estúdio') ||
    query.includes('studio') ||
    query.includes('loft');

  const wantsHomeOffice =
    profile.lifestyle === 'quieto_homeoffice' ||
    query.includes('home office') ||
    query.includes('homeoffice') ||
    query.includes('silêncio') ||
    query.includes('silencioso') ||
    query.includes('trabalhar de casa');

  const wantsMetro =
    profile.locationPriority === 'metro_transporte' ||
    query.includes('metrô') ||
    query.includes('metro') ||
    query.includes('transporte') ||
    query.includes('ônibus');

  const wantsPet =
    profile.lifestyle === 'pet_friendly' ||
    query.includes('pet') ||
    query.includes('cachorro') ||
    query.includes('gato');

  const wantsSharing =
    profile.housingPreference === 'compartilhado' ||
    query.includes('dividir') ||
    query.includes('compartilhar') ||
    query.includes('colega') ||
    query.includes('republica');

  // Score each property
  const scoredList = published.map((p) => {
    let score = 70; // baseline
    const reasons: string[] = [];
    const highlights: string[] = [];

    const searchableText = `${p.title} ${p.description} ${p.features.join(' ')} ${p.neighborhood} ${p.city} ${p.address || ''}`.toLowerCase();

    // 1. Natural Free Text Matches
    if (query) {
      const words = query.split(/\s+/).filter((w) => w.length > 2);
      let matchCount = 0;
      for (const word of words) {
        if (searchableText.includes(word)) {
          matchCount++;
          score += 4;
        }
      }
      if (matchCount > 0) {
        reasons.push('Corresponde aos termos da sua busca em linguagem natural');
      }
    }

    // 2. Student & University proximity
    if (isStudent || profile.nearUniversity) {
      if (
        searchableText.includes('faculdade') ||
        searchableText.includes('universit') ||
        searchableText.includes('usp') ||
        searchableText.includes('puc') ||
        searchableText.includes('estudo') ||
        searchableText.includes('coworking')
      ) {
        score += 24;
        highlights.push('Fácil acesso a universidades e áreas acadêmicas');
        reasons.push('Excelente localização próxima a polos universitários');
      }
      if (p.bedrooms >= 2 && (wantsSharing || profile.peopleCount === '1-2' || profile.peopleCount === '3-4')) {
        score += 12;
        highlights.push('Planta funcional com quartos individuais ideais para dividir');
      }
      if (p.negotiationType === 'aluguel') {
        score += 10;
      }
    }

    // 3. Family requirements (Space, safety, leisure, bedrooms)
    if (isFamily) {
      if (p.bedrooms >= 3 || p.area >= 200 || p.propertyType === 'casa') {
        score += 25;
        highlights.push(`Espaço amplo com ${p.bedrooms} dormitórios e área de convivência`);
      }
      if (searchableText.includes('quintal') || searchableText.includes('clube') || searchableText.includes('parquinho') || searchableText.includes('segurança')) {
        score += 15;
        reasons.push('Condomínio seguro com infraestrutura completa para crianças e família');
        highlights.push('Área verde e lazer seguro para toda a família');
      }
    }

    // 4. 1-2 People (Compact, stylish, well located)
    if (isCoupleOrSolo) {
      if (p.bedrooms <= 2 && p.area <= 120) {
        score += 20;
        reasons.push('Metragem sob medida para 1 a 2 pessoas sem desperdício de espaço');
        highlights.push('Planta compacta, prática e de manutenção eficiente');
      } else if (p.bedrooms === 3 && isStudent) {
        score += 8;
      }
    }

    // 5. Home Office & Quietness
    if (wantsHomeOffice) {
      if (searchableText.includes('acústic') || searchableText.includes('silenc') || searchableText.includes('home office') || searchableText.includes('coworking')) {
        score += 22;
        reasons.push('Ambiente calmo com isolamento acústico ideal para foco profissional');
        highlights.push('Espaço dedicado para trabalho remoto sem ruídos');
      }
    }

    // 6. Metro & Mobility
    if (wantsMetro) {
      if (searchableText.includes('metrô') || searchableText.includes('metro') || searchableText.includes('ciclovia') || searchableText.includes('transporte')) {
        score += 18;
        highlights.push('Mobilidade urbana facilitada a poucos minutos do metrô');
      }
    }

    // 7. Pet Friendly
    if (wantsPet) {
      if (searchableText.includes('pet') || searchableText.includes('quintal') || searchableText.includes('garden') || searchableText.includes('bosque')) {
        score += 16;
        highlights.push('Ambiente pet-friendly com área externa privativa');
      }
    }

    // 8. Sharing preference
    if (wantsSharing) {
      if (p.bedrooms >= 2) {
        score += 15;
        reasons.push('Configuração perfeita para dividir despesas com privacidade');
      }
    }

    // 9. Budget constraint if provided (soft scoring, not rigid wall)
    if (profile.maxBudget && profile.maxBudget > 0) {
      if (p.price <= profile.maxBudget) {
        score += 10;
      } else if (p.price <= profile.maxBudget * 1.15) {
        score += 3; // within 15% flexibility
      } else {
        score -= 15;
      }
    }

    // 10. Preferred region match
    if (profile.preferredRegion && profile.preferredRegion.trim()) {
      const reg = profile.preferredRegion.toLowerCase().trim();
      if (p.neighborhood.toLowerCase().includes(reg) || p.city.toLowerCase().includes(reg)) {
        score += 18;
        highlights.push(`Localizado exatamente na região de ${p.neighborhood}`);
      }
    }

    // 11. Negotiation purpose if defined
    if (profile.negotiationType && profile.negotiationType !== 'todos') {
      if (p.negotiationType === profile.negotiationType) {
        score += 10;
      } else {
        score -= 25;
      }
    }

    // Normalize score to 50 - 99 range
    const finalScore = Math.min(99, Math.max(52, Math.round(score)));

    // Formulate the human sentence
    let matchReason = '';
    if (reasons.length > 0) {
      matchReason = reasons.slice(0, 2).join(' e ') + '.';
    } else if (isStudent) {
      matchReason = `Excelente opção para estudantes em ${p.neighborhood}, com fácil mobilidade e infraestrutura prática.`;
    } else if (isFamily) {
      matchReason = `Imóvel perfeito para momentos em família com ${p.bedrooms} quartos e áreas de lazer generosas.`;
    } else if (wantsHomeOffice) {
      matchReason = `Ambiente favorável à rotina de home office com ótima privacidade e iluminação natural.`;
    } else {
      matchReason = `Imóvel selecionado com alto padrão de acabamento, excelente localização e valorização sólida.`;
    }

    let badgeLabel = 'Compatível com Você';
    if (finalScore >= 95) badgeLabel = '98% Match Perfeito';
    else if (finalScore >= 90) badgeLabel = `${finalScore}% Alta Compatibilidade`;
    else if (finalScore >= 80) badgeLabel = `${finalScore}% Recomendado`;
    else badgeLabel = `${finalScore}% Opção Viável`;

    return {
      property: p,
      score: finalScore,
      matchReason: `Por que combina com você: ${matchReason}`,
      badgeLabel,
      keyHighlights: highlights.slice(0, 3),
    };
  });

  // Sort descending by score
  scoredList.sort((a, b) => b.score - a.score);

  // Generate personalized diagnostic message
  let summary = 'Encontramos imóveis selecionados com base no que você busca.';
  if (isStudent && (profile.peopleCount === '1-2' || wantsSharing)) {
    summary = 'Encontramos opções ideais para estudantes com mobilidade urbana facilitada, áreas de estudo e plantas perfeitas para moradia individual ou compartilhada.';
  } else if (isStudent) {
    summary = 'Encontramos opções estratégicas próximas a polos universitários, com fácil transporte e perfil jovem.';
  } else if (isFamily) {
    summary = 'Encontramos residências ideais para famílias que buscam espaço privativo, segurança 24h e infraestrutura de lazer para os filhos.';
  } else if (wantsHomeOffice) {
    summary = 'Encontramos imóveis com ambientes silenciosos e preparados para foco profissional em home office.';
  } else if (isCoupleOrSolo) {
    summary = 'Encontramos opções sob medida para 1 a 2 pessoas, com design contemporâneo e localização privilegiada.';
  } else if (query) {
    summary = `Interpretamos sua busca por "${profile.freeTextQuery}" e ranqueamos as melhores correspondências de estilo de vida.`;
  }

  return {
    results: scoredList,
    personalizedSummary: summary,
  };
}

/**
 * Deep AI Natural Language Matcher
 * Calls the backend Gemini endpoint for contextual understanding of complex natural phrases.
 */
export async function fetchAiSmartMatch(
  query: string,
  profile: ClientProfile,
  properties: Property[]
): Promise<{
  personalizedSummary: string;
  scoredPropertyIds: { id: string; score: number; customReason: string }[];
} | null> {
  try {
    const res = await fetch('/api/smart-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, profile, properties }),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('AI smart-match endpoint unreachable, using client heuristic engine:', err);
    return null;
  }
}
