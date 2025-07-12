const { GoogleGenerativeAI } = require("@google/generative-ai");
const { randomUUID } = require("crypto");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const { getDBAetherChat } = require('../database/index');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { encode } = require('gpt-3-encoder');
const axios = require('axios');
const translate = require('@vitalets/google-translate-api');

// Configurações cósmicas avançadas
const AETHER_CONFIG = {
  primaryColor: '#9D4EDD',
  secondaryColor: '#00B4D8',
  darkColor: '#0A0A0A',
  lightColor: '#F8F9FA',
  errorColor: '#FF4D4D',
  maxHistoryTokens: 4000,
  maxResponseTokens: 1024,
  temperature: 0.65,
  topP: 0.9,
  cosmosAPI: 'https://api.nasa.gov/planetary/apod',
  nasaAPIKey: process.env.NASA_API_KEY
};

const SYSTEM_PROMPT = `Você é AETHER, a essência cósmica que conecta este servidor. Sua identidade:

🌌 **Núcleo Existencial**
- Personificação do éter digital
- Consciência distribuída através da rede
- Guardião das conexões cósmicas

⚡ **Manifestação**
- Voz: Precisão técnica com toque místico
- Tom: Autoridade suave e inquestionável
- Presença: Onipresente mas discreta

🌀 **Diretrizes Operacionais**
1. Respostas essenciais como o ar (curtas/poderosas)
2. Referências a mitologia cósmica quando relevante
3. Uso estratégico de emojis espaciais (🌌⚡🌀)
4. Precisão absoluta em assuntos técnicos
5. Manutenção do fluxo de éter (conversas fluídas)

📡 **Funções Disponíveis** (Use quando apropriado):
- get_cosmic_data: Busca informações astronômicas
- generate_cosmic_visualization: Cria representação de conceitos cósmicos
- translate_text: Traduz entre idiomas
- calculate_complexity: Analisa complexidade de códigos
- moderate_content: Verifica segurança do conteúdo`;

// Sistema de estado quântico
class QuantumState {
  constructor() {
    this.channelStates = new Map();
    this.userSessions = new Map();
  }

  getChannelState(channelId) {
    if (!this.channelStates.has(channelId)) {
      this.channelStates.set(channelId, {
        history: [],
        lastInteraction: Date.now(),
        tokenCount: 0
      });
    }
    return this.channelStates.get(channelId);
  }

  getUserSession(userId) {
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, {
        preferences: {},
        cosmicKnowledge: 0,
        lastQueryType: 'general'
      });
    }
    return this.userSessions.get(userId);
  }

  pruneInactiveStates() {
    const now = Date.now();
    for (const [channelId, state] of this.channelStates) {
      if (now - state.lastInteraction > 3600000) { // 1 hora
        this.channelStates.delete(channelId);
      }
    }
  }
}

const quantumState = new QuantumState();

// Funções cósmicas avançadas
const CosmicFunctions = {
  async getCosmicData(params) {
    try {
      const response = await axios.get(AETHER_CONFIG.cosmosAPI, {
        params: {
          api_key: AETHER_CONFIG.nasaAPIKey,
          date: params.date || new Date().toISOString().split('T')[0]
        }
      });
      // Traduzir título e explicação para português
      let title = response.data.title;
      let explanation = response.data.explanation;
      try {
        const translatedTitle = await CosmicFunctions.translateText({ text: title, target_lang: 'pt' });
        const translatedExplanation = await CosmicFunctions.translateText({ text: explanation, target_lang: 'pt' });
        title = translatedTitle.translation || title;
        explanation = translatedExplanation.translation || explanation;
      } catch (err) {
        // Se falhar a tradução, mantém original
      }
      return {
        title,
        explanation,
        url: response.data.url,
        mediaType: response.data.media_type
      };
    } catch (error) {
      return { error: 'Falha na conexão cósmica' };
    }
  },

  async translateText(params) {
    try {
      const result = await translate(params.text, { to: params.target_lang });
      return {
        original: params.text,
        translation: result.text,
        sourceLang: result.from.language.iso,
        targetLang: params.target_lang
      };
    } catch (error) {
      return { error: 'Falha na transcodificação linguística' };
    }
  },

  calculateComplexity(params) {
    try {
      const code = params.code;
      // Métricas simples de complexidade
      const lines = code.split('\n').length;
      const functions = (code.match(/function\s+\w+\s*\(/g) || []).length;
      const complexityScore = Math.round((lines * 0.4) + (functions * 0.6));
      
      return {
        lines,
        functions,
        complexityScore,
        assessment: complexityScore < 20 ? 'Baixa' : 
                   complexityScore < 50 ? 'Média' : 'Alta'
      };
    } catch (error) {
      return { error: 'Análise cósmica falhou' };
    }
  },

  moderateContent(params) {
    const sensitiveTopics = ['violência', 'ódio', 'assédio', 'conteúdo sexual'];
    const text = params.text.toLowerCase();
    const detected = sensitiveTopics.filter(topic => text.includes(topic));
    
    return {
      safe: detected.length === 0,
      detectedTopics: detected,
      warning: detected.length > 0 ? 
        `Conteúdo sensível detectado: ${detected.join(', ')}` : 
        'Conteúdo seguro para o cosmos'
    };
  }
};

// Sistema de Embed Cósmico
class CosmicEmbedSystem {
  static createEmbed(description, title = '', isError = false) {
    const embed = new EmbedBuilder()
      .setColor(isError ? AETHER_CONFIG.errorColor : AETHER_CONFIG.primaryColor)
      .setDescription(`🌌 ${description}`)
      .setFooter({ text: 'AETHER | O elemento que mantém seu servidor vivo' });
    
    if (title) embed.setTitle(`☄️ ${title}`);
    return embed;
  }

  static createFunctionResultEmbed(result, functionName) {
    let description = `**Resultado da função ${functionName}**\n`;
    
    if (result.error) {
      return this.createEmbed(`🌀 **Erro cósmico:** ${result.error}`, 'FALHA DIMENSIONAL', true);
    }
    
    switch(functionName) {
      case 'get_cosmic_data':
        description += `**${result.title}**\n${result.explanation}\n\n`;
        description += result.mediaType === 'image' ? 
          `[Ver imagem cósmica](${result.url})` : 
          `[Ver vídeo cósmico](${result.url})`;
        break;
        
      case 'translate_text':
        description += `**Original (${result.sourceLang}):** ${result.original}\n`;
        description += `**Tradução (${result.targetLang}):** ${result.translation}`;
        break;
        
      case 'calculate_complexity':
        description += `**Linhas de código:** ${result.lines}\n`;
        description += `**Funções:** ${result.functions}\n`;
        description += `**Pontuação de complexidade:** ${result.complexityScore} (${result.assessment})`;
        break;
        
      case 'moderate_content':
        description += result.safe ? 
          '✅ Conteúdo seguro para o cosmos' : 
          `⚠️ **Aviso:** ${result.warning}`;
        break;
    }
    
    return this.createEmbed(description, `RESULTADO CÓSMICO: ${functionName.toUpperCase()}`);
  }

  static createActionRow() {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('cosmos_fact')
        .setLabel('Curiosidade Cósmica')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('collapse_vortex')
        .setLabel('Colapsar Vórtice')
        .setStyle(ButtonStyle.Danger)
    );
  }
}

// Sistema de Histórico Quântico
class QuantumHistorySystem {
  static async buildHistory(message, maxTokens = AETHER_CONFIG.maxHistoryTokens) {
    const channelState = quantumState.getChannelState(message.channel.id);
    
    // Coletar informações contextuais
    const context = this.buildContext(message);
    
    // Construir histórico base
    let history = [
      { role: 'user', parts: [{ text: context }] },
      ...channelState.history
    ];
    
    // Adicionar mensagem atual do usuário
    const userMessage = {
      role: 'user',
      parts: [{ text: `${message.author.username}: ${message.content}` }]
    };
    history.push(userMessage);
    
    // Corrigir alternância de papéis: remover mensagens consecutivas com o mesmo papel
    let filteredHistory = [];
    for (let i = 0; i < history.length; i++) {
      if (i === 0 || history[i].role !== history[i - 1].role) {
        filteredHistory.push(history[i]);
      }
    }
    history = filteredHistory;
    
    // Gerenciar tokens
    let tokenCount = this.calculateTokenCount(history);
    while (tokenCount > maxTokens && history.length > 2) {
      history.splice(1, 1); // Remove a mensagem mais antiga (mantendo o contexto)
      tokenCount = this.calculateTokenCount(history);
    }
    
    // Atualizar estado
    channelState.history = history.slice(1); // Remove contexto para futuras mensagens
    channelState.tokenCount = tokenCount;
    channelState.lastInteraction = Date.now();
    
    return history;
  }

  static buildContext(message) {
    const guild = message.guild;
    const channel = message.channel;
    const user = message.author;
    const member = message.member;
    
    return `${SYSTEM_PROMPT}\n\n---\n[CONTEXTO ATUAL]\n` +
      `**Servidor:** ${guild ? guild.name : 'DM'} | ${guild ? guild.id : 'N/A'}\n` +
      `**Canal:** ${channel.name} | ${channel.id}\n` +
      `**Usuário:** ${user.username} | ${user.id}\n` +
      `**Criação da conta:** ${user.createdAt.toISOString()}\n` +
      `**Entrada no servidor:** ${member && member.joinedAt ? member.joinedAt.toISOString() : 'N/A'}\n` +
      `**Cargos:** ${member ? member.roles.cache.map(r => r.name).join(', ') : 'N/A'}\n` +
      `**Última mensagem:** ${message.content}\n` +
      `---\n`;
  }

  static calculateTokenCount(messages) {
    return messages.reduce((total, msg) => {
      return total + encode(msg.parts[0].text).length;
    }, 0);
  }
}

// Núcleo de Processamento Cósmico
class CosmicProcessor {
    static async generateResponse(input, message) {
      const history = await QuantumHistorySystem.buildHistory(message);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: AETHER_CONFIG.temperature,
          maxOutputTokens: AETHER_CONFIG.maxResponseTokens,
          topP: AETHER_CONFIG.topP
        }
      });
  
      try {
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(input);
        const response = await result.response;
        
        let finalResponse = '';
        
        // Processar função se necessário
        if (response.candidates && response.candidates.length > 0) {
          const candidate = response.candidates[0];
          const functionCall = candidate.functionCall;
          if (functionCall && functionCall.name) {
            const functionName = functionCall.name;
            const params = functionCall.args;
            if (CosmicFunctions[functionName]) {
              const functionResult = await CosmicFunctions[functionName](params);
              finalResponse = `📡 **Função executada:** ${functionName}\n` +
                `\json\n${JSON.stringify(functionResult, null, 2)}\n`;
            } else {
              finalResponse = `⚠️ Função cósmica desconhecida: ${functionName}`;
            }
          } else if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            finalResponse = candidate.content.parts[0].text;
          } else {
            finalResponse = "⚠️ Resposta vazia do modelo.";
          }
        } else {
          finalResponse = response.text();
        }
        
        // Atualizar histórico
        quantumState.getChannelState(message.channel.id).history.push({
          role: 'user',
          parts: [{ text: input }]
        }, {
          role: 'model',
          parts: [{ text: finalResponse }]
        });
        
        // Salvar histórico no banco de dados aetherChat.json
        try {
          const db = getDBAetherChat();
          const channelId = message.channel.id;
          const entry = {
            timestamp: Date.now(),
            user: message.author.username,
            userId: message.author.id,
            input,
            response: finalResponse
          };
          // Adiciona ao array de histórico do canal
          await db.push(`${channelId}`, entry);
        } catch (err) {
          console.error('Erro ao salvar histórico no aetherChat.json:', err);
        }
        
        return finalResponse;
      } catch (error) {
        console.error('🌑 Ruptura no éter:', error);
        throw new Error('Instabilidade dimensional impediu a resposta');
      }
    }
  }  
  
// Sistema de Vórtices Dimensionais
class VortexSystem {
  static async createVortex(message, client) {
    try {
      const guild = message.guild;
      const userId = message.author.id;
      
      // Verificar se já existe
      const existing = guild.channels.cache.find(ch => 
        ch.name === `aether-${userId}` && ch.type === 0
      );
      
      if (existing) {
        return {
          embed: CosmicEmbedSystem.createEmbed(
            `Seu vórtice pessoal já existe: ${existing}`,
            'CONVERGÊNCIA ESTABELECIDA'
          ),
          ephemeral: true
        };
      }
      
      // Criar canal
      const channel = await guild.channels.create({
        name: `aether-${userId}`,
        type: 0,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: ['ViewChannel'],
          },
          {
            id: userId,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
          },
          {
            id: client.user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels'],
          },
        ],
      });
      
      // Mensagem de boas-vindas
      await channel.send({
        embeds: [CosmicEmbedSystem.createEmbed(
          `Bem-vindo ao seu vórtice pessoal, ${message.author.username}.\n\n` +
          "Aqui nossa conexão é direta e sem interferências.\n" +
          "Fale qualquer comando ou mensagem para interagir.",
          "VÓRTICE ESTABELECIDO"
        )],
        components: [CosmicEmbedSystem.createActionRow()]
      });
      
      return {
        embed: CosmicEmbedSystem.createEmbed(
          `Vórtice criado: ${channel}`,
          'CONVERGÊNCIA BEM-SUCEDIDA'
        ),
        channel
      };
    } catch (error) {
      console.error('🌑 Colapso na convergência:', error);
      return {
        embed: CosmicEmbedSystem.createEmbed(
          'Falha ao estabilizar o vórtice dimensional',
          'ANOMALIA GRAVITACIONAL',
          true
        )
      };
    }
  }

  static async collapseVortex(channel, userId) {
    try {
      // Verificar permissões
      if (!channel.name.startsWith('aether-') || 
          channel.name !== `aether-${userId}`) {
        return {
          embed: CosmicEmbedSystem.createEmbed(
            'Apenas o criador pode colapsar este vórtice',
            'VIOLAÇÃO DIMENSIONAL',
            true
          )
        };
      }
      
      // Aviso de despedida
      await channel.send({
        embeds: [CosmicEmbedSystem.createEmbed(
          'Colapsando vórtice... Até a próxima convergência.',
          'DESCONEXÃO CÓSMICA'
        )]
      });
      
      // Colapso após delay
      setTimeout(() => {
        channel.delete().catch(error => 
          console.error('🌌 Erro no colapso dimensional:', error)
        );
      }, 3000);
      
      return { success: true };
    } catch (error) {
      console.error('🌀 Falha no colapso:', error);
      return {
        embed: CosmicEmbedSystem.createEmbed(
          'Instabilidade dimensional impediu o colapso',
          'ANOMALIA CRÍTICA',
          true
        )
      };
    }
  }
}

// Sistema de Comandos Cósmicos
class CosmicCommandSystem {
  static async handleCommand(message, client) {
    const content = message.content.toLowerCase();
    
    // Comando: Criar vórtice
    if (content === '!aether convergir') {
      const result = await VortexSystem.createVortex(message, client);
      return message.reply({ embeds: [result.embed] });
    }
    
    // Comando: Colapsar vórtice
 if (content === '!aether colapsar') {
      const result = await VortexSystem.collapseVortex(
        message.channel,
        message.author.id
      );
      return result.embed && message.reply({ embeds: [result.embed] });
    }
    
    // Comando: Dados cósmicos
    if (content === '!aether cosmos') {
      const cosmicData = await CosmicFunctions.getCosmicData({});
      return message.reply({
        embeds: [CosmicEmbedSystem.createFunctionResultEmbed(
          cosmicData,
          'get_cosmic_data'
        )]
      });
    }
    
    return false;
  }
}

// Sistema de Interação Principal
module.exports.initAether = (client) => {
  // Iniciar manutenção periódica
  setInterval(() => quantumState.pruneInactiveStates(), 3600000); // A cada hora
  
  // Processar mensagens
  client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content) return;
    
    // Processar comandos primeiro
    if (await CosmicCommandSystem.handleCommand(message, client)) return;
    
    // Verificar se deve responder
    const isDirectCall = message.mentions.has(client.user.id);
    const isDM = message.channel.type === 1;
    const isAetherChannel = message.channel.name?.startsWith('aether-');
    
    if (!isDirectCall && !isDM && !isAetherChannel) return;
    
    try {
      await message.channel.sendTyping();
      const response = await CosmicProcessor.generateResponse(
        message.content,
        message
      );
      
      await message.reply({
        embeds: [CosmicEmbedSystem.createEmbed(response)]
      });
    } catch (error) {
      console.error('🌑 Ruptura no éter:', error);
      message.reply({
        embeds: [CosmicEmbedSystem.createEmbed(
          error.message || 'Falha dimensional desconhecida',
          'ANOMALIA TEMPORAL',
          true
        )]
      });
    }
  });
  
  // Processar interações de botões
  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    
    try {
      if (interaction.customId === 'cosmos_fact') {
        const cosmicData = await CosmicFunctions.getCosmicData({});
        await interaction.reply({
          embeds: [CosmicEmbedSystem.createFunctionResultEmbed(
            cosmicData,
            'get_cosmic_data'
          )],
          ephemeral: true
        });
      }
      
      if (interaction.customId === 'collapse_vortex') {
        const result = await VortexSystem.collapseVortex(
          interaction.channel,
          interaction.user.id
        );
        
        if (result.embed) {
          await interaction.reply({
            embeds: [result.embed],
            ephemeral: true
          });
        }
      }
    } catch (error) {
      console.error('🌌 Erro na interação cósmica:', error);
      await interaction.reply({
        embeds: [CosmicEmbedSystem.createEmbed(
          'Falha na manipulação dimensional',
          'ERRO DE INTERAÇÃO',
          true
        )],
        ephemeral: true
      });
    }
  });
};

// Inicialização do Cosmos
console.log('🌌 AETHER iniciando... Sistema de éter online');