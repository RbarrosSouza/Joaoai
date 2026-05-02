{
  "nodes": [
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "8ca54eae-15d1-49d3-af33-7a6e5d17b833",
              "leftValue": "={{ $json.tipo }}",
              "rightValue": "incoming",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            },
            {
              "id": "82912d66-ee4b-439c-9d55-96090bc6ba62",
              "leftValue": "={{ $json.etiquetas }}",
              "rightValue": "agente-off",
              "operator": {
                "type": "array",
                "operation": "notContains",
                "rightType": "any"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.filter",
      "typeVersion": 2.2,
      "position": [
        -4000,
        1376
      ],
      "id": "25f96c11-eb13-4740-9465-32481c6510cc",
      "name": "Mensagem chegando?"
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "e1100778-9698-42a1-953d-913961a4c527",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        -4352,
        1376
      ],
      "id": "7cd2f0a8-8d37-479d-8805-587d7e26ac3c",
      "name": "Mensagem recebida",
      "webhookId": "e1100778-9698-42a1-953d-913961a4c527"
    },
    {
      "parameters": {
        "jsCode": "const ultima_mensagem_da_fila = $input.last()\nconst mensagem_do_workflow = $('Info').first()\n\nif (ultima_mensagem_da_fila.json.id_mensagem !== mensagem_do_workflow.json.id_mensagem) {\n  // Mensagem encavalada, para o workflow\n  return [];\n}\n\n// Pass-through da fila de mensagens\nreturn $input.all();"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -2560,
        1056
      ],
      "id": "034f80f9-89f2-4cc0-9bd3-4845b68cce02",
      "name": "Mensagem encavalada?"
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "n8n_fila_mensagens",
          "mode": "list"
        },
        "returnAll": true,
        "where": {
          "values": [
            {
              "column": "telefone",
              "value": "={{ $('Info').item.json.telefone }}"
            }
          ]
        },
        "sort": {
          "values": [
            {
              "column": "timestamp"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        -2784,
        1056
      ],
      "id": "822eba8a-194d-4549-9b25-e7d2bffa09b8",
      "name": "Buscar mensagens",
      "credentials": {
        "postgres": {
          "id": "yZ0x55N1R2A3pz0r",
          "name": "Postgres João.ai"
        }
      }
    },
    {
      "parameters": {
        "operation": "deleteTable",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "n8n_fila_mensagens",
          "mode": "list"
        },
        "deleteCommand": "delete",
        "where": {
          "values": [
            {
              "column": "telefone",
              "value": "={{ $json.telefone }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        -2352,
        1056
      ],
      "id": "20e9a40e-f428-40d2-af8f-cffd48b1702d",
      "name": "Limpar fila de mensagens",
      "credentials": {
        "postgres": {
          "id": "yZ0x55N1R2A3pz0r",
          "name": "Postgres João.ai"
        }
      }
    },
    {
      "parameters": {
        "content": "# Processando mensagens encavaladas\n\nEssa etapa trata a situação em que o usuário envia múltiplas mensagens seguidas. O ponto negativo é o aumento no tempo de resposta do agente. Lógica dispensa uso de soluções mais complexas, como RabbitMQ.\n\nTempo de espera recomendado de ~16s. Quando estiver testando, recomendamos reduzir um pouco para ficar mais rápido de testar.\n",
        "height": 380,
        "width": 1080,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        -3296,
        864
      ],
      "id": "d1712ec7-c1c9-4402-8995-7d3115c56598",
      "name": "Sticky Note2"
    },
    {
      "parameters": {
        "amount": 1
      },
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        -2992,
        1056
      ],
      "id": "f6824dc3-3f7a-45a1-9c2d-24ded00c06ce",
      "name": "Esperar",
      "webhookId": "88a86305-9f6b-4328-9ff3-9644d3e36b70"
    },
    {
      "parameters": {
        "content": "# Tratando input\n",
        "height": 540,
        "width": 1060
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        -4432,
        1184
      ],
      "id": "816f890f-a5d1-4be8-a395-dfb005431141",
      "name": "Sticky Note5"
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "leftValue": "={{ $('Info').item.json.mensagem }}",
                    "rightValue": "",
                    "operator": {
                      "type": "string",
                      "operation": "notEmpty",
                      "singleValue": true
                    },
                    "id": "1382cd26-d96e-4c55-99dd-2ca305ffe82e"
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Texto"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "b9a7e16f-b6e4-45d7-846d-92dcb3117593",
                    "leftValue": "={{ $('Info').item.json.mensagem_de_audio }}",
                    "rightValue": "",
                    "operator": {
                      "type": "boolean",
                      "operation": "true",
                      "singleValue": true
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Áudio"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "4576f00e-a5f5-4498-b798-88bf8896e23a",
                    "leftValue": "={{ $json.tipo_anexo }}",
                    "rightValue": "image",
                    "operator": {
                      "type": "string",
                      "operation": "equals",
                      "name": "filter.operator.equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "imagem"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "2c4e147c-4807-4a2b-a467-f93ebab5c297",
                    "leftValue": "={{ $json.tipo_anexo }} ",
                    "rightValue": "file",
                    "operator": {
                      "type": "string",
                      "operation": "equals",
                      "name": "filter.operator.equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "imagem"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "a992edea-126d-4c40-b31c-357b06e15640",
                    "leftValue": "={{ $json.url_anexo.toLowerCase().includes('.pdf') }}",
                    "rightValue": "true",
                    "operator": {
                      "type": "boolean",
                      "operation": "exists",
                      "singleValue": true
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Imagem"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3.2,
      "position": [
        -3616,
        1328
      ],
      "id": "a588b0d4-0c20-412f-a274-d4fe1ed72f45",
      "name": "Tipo de mensagem"
    },
    {
      "parameters": {
        "content": "# Processando áudio",
        "height": 308,
        "width": 1080,
        "color": 6
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        -3296,
        1264
      ],
      "id": "f4e78385-623c-4e6a-bd4b-0a20ae718f8f",
      "name": "Sticky Note6"
    },
    {
      "parameters": {
        "content": "Para testar, criar uma tag \"testando-agente\" e usar no número que enviará as mensagens para a secretária durante os testes. Você pode marcar o seu número no Chatwoot com essa tag para que o agente responda apenas você. Depois de testar e validar, só remover a regra do filtro pro seu agente responder todo mundo.\n\n",
        "height": 80,
        "width": 1016,
        "color": 3
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        -4400,
        1632
      ],
      "id": "21218678-30c5-4d01-bcb3-d83cd9da65a9",
      "name": "Sticky Note8"
    },
    {
      "parameters": {
        "content": "# Marcar como lida e \"digitando...\"",
        "height": 300,
        "width": 596,
        "color": 5
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        -2176,
        1264
      ],
      "id": "96856b29-9499-44a7-a4a0-dfc02df62601",
      "name": "Sticky Note12"
    },
    {
      "parameters": {
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "n8n_fila_mensagens",
          "mode": "list"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "telefone": "={{ $('Info').item.json.telefone ?? $('Info').item.json.conversation?.meta?.sender?.phone_number }}",
            "mensagem": "={{ $('Info').item.json.mensagem }}",
            "timestamp": "={{ $('Info').item.json.timestamp.toDateTime() }}",
            "id_mensagem": "={{ $('Info').item.json.id_mensagem }}",
            "url_chatwoot": "={{ $('Info').item.json.url_chatwoot }}",
            "id_conversa": "={{ $('Info').item.json.id_conversa }}",
            "id_conta": "={{ $('Info').item.json.id_conta }}"
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": false,
              "defaultMatch": true,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "id_mensagem",
              "displayName": "id_mensagem",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "telefone",
              "displayName": "telefone",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "mensagem",
              "displayName": "mensagem",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "timestamp",
              "displayName": "timestamp",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true
            },
            {
              "id": "status",
              "displayName": "status",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "processing_at",
              "displayName": "processing_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "id_conta",
              "displayName": "id_conta",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "id_conversa",
              "displayName": "id_conversa",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "url_chatwoot",
              "displayName": "url_chatwoot",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        -3216,
        1056
      ],
      "id": "297855c7-ee2f-474a-8d59-659437a3e22e",
      "name": "Enfileirar mensagem.",
      "credentials": {
        "postgres": {
          "id": "yZ0x55N1R2A3pz0r",
          "name": "Postgres João.ai"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Info').item.json.url_chatwoot }}/api/v1/accounts/{{ $('Info').item.json.id_conta }}/conversations/{{ $('Info').item.json.id_conversa }}/update_last_seen",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -2032,
        1360
      ],
      "id": "3fe19acd-0664-45c5-8a28-bf1b1568600e",
      "name": "Marcar como lidas",
      "credentials": {
        "httpHeaderAuth": {
          "id": "Uu2idpJ4OzVCCTJG",
          "name": "ChatWoot_Joaoai"
        }
      }
    },
    {
      "parameters": {
        "url": "={{ $('Mensagem recebida').item.json.body.attachments[0].data_url }}",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -3184,
        1376
      ],
      "id": "b614fe35-1412-4e99-a92e-16db292352e7",
      "name": "Download áudio",
      "credentials": {
        "httpHeaderAuth": {
          "id": "Fywlx3sq0hc1Ndqz",
          "name": "Header Auth account"
        }
      }
    },
    {
      "parameters": {
        "resource": "audio",
        "operation": "transcribe",
        "options": {
          "language": "pt"
        }
      },
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.8,
      "position": [
        -2480,
        1376
      ],
      "id": "b9662db0-329a-4e90-8fde-63e4fb87b0bf",
      "name": "Transcrever audio",
      "credentials": {
        "openAiApi": {
          "id": "vKBno59QWhuUp1sz",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "operation": "binaryToPropery",
        "options": {}
      },
      "type": "n8n-nodes-base.extractFromFile",
      "typeVersion": 1,
      "position": [
        -2944,
        1376
      ],
      "id": "2cedf798-5a40-4c09-babd-7d787bda411f",
      "name": "Extract from File"
    },
    {
      "parameters": {
        "operation": "toBinary",
        "sourceProperty": "data",
        "options": {}
      },
      "type": "n8n-nodes-base.convertToFile",
      "typeVersion": 1.1,
      "position": [
        -2704,
        1376
      ],
      "id": "d3349957-d547-44b9-b5d5-f9acd62d05fd",
      "name": "Convert to File"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "c8fd010d-6096-4a50-b3e2-e9fe26661840",
              "name": "id_mensagem",
              "value": "={{ $json.body.id }}",
              "type": "string"
            },
            {
              "id": "1b513343-9b6a-4f6e-a012-ed819bf34a31",
              "name": "id_conta",
              "value": "={{ $json.body.account.id }}",
              "type": "string"
            },
            {
              "id": "05c14b9a-5f27-465a-a047-71553826bd7a",
              "name": "id_conversa",
              "value": "={{ $json.body.conversation.id }}",
              "type": "string"
            },
            {
              "id": "8bf522a6-75fb-434a-854c-b736539309e1",
              "name": "telefone",
              "value": "={{ $json.body.sender.phone_number }}",
              "type": "string"
            },
            {
              "id": "0d622a33-f313-4758-a764-fa6cbf2b0587",
              "name": "mensagem",
              "value": "={{ $json.body.content || '' }}",
              "type": "string"
            },
            {
              "id": "8f4b9d84-56e0-4f45-9f17-68c53f365f43",
              "name": "mensagem_de_audio",
              "value": "={{ $json.body.attachments?.[0]?.meta?.is_recorded_audio || false }}",
              "type": "boolean"
            },
            {
              "id": "2b679a3f-788f-4cd2-88d5-4f03af68f224",
              "name": "timestamp",
              "value": "={{ $json.body.created_at }}",
              "type": "string"
            },
            {
              "id": "24caf88e-74ce-43ab-8dc4-1fff471b706f",
              "name": "tipo",
              "value": "={{ $json.body.message_type }}",
              "type": "string"
            },
            {
              "id": "573669d2-1e43-4010-8c82-a67459ffe1db",
              "name": "etiquetas",
              "value": "={{ $json.body.conversation.labels }}",
              "type": "array"
            },
            {
              "id": "40ff895f-f63f-4e4f-bba3-c7d803c277f1",
              "name": "url_chatwoot",
              "value": "http://76.13.164.208:3000/",
              "type": "string"
            },
            {
              "id": "cf71dea1-d585-4235-8f05-29bc5f82b5df",
              "name": "telegram_chat_id",
              "value": "<colar seu telegram chat id>",
              "type": "string"
            },
            {
              "id": "6ba9787f-1f32-4c8b-81b6-a746223e4b43",
              "name": "Tipo de Anexo",
              "value": "{{ $json.body.attachments[0].file_type }}",
              "type": "string"
            },
            {
              "id": "6601f3b6-1840-491a-8e56-962b00b54755",
              "name": "=url_anexo",
              "value": "={{ $json.body.attachments[0].data_url }}",
              "type": "string"
            },
            {
              "id": "fa03b9c1-e167-432c-86b7-52d2ca1bfcb3",
              "name": "body.account.name",
              "value": "={{ $json.body.account.name }}",
              "type": "string"
            },
            {
              "id": "4137f0d6-bdc2-4ba1-ab6b-bf85506e11bb",
              "name": "=PDF",
              "value": "={{ $json.body.attachments[0].file_type }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -4176,
        1376
      ],
      "id": "264c1a5c-fc72-4acb-8952-ff398791df15",
      "name": "Info"
    },
    {
      "parameters": {},
      "type": "n8n-nodes-base.merge",
      "typeVersion": 3.1,
      "position": [
        -2704,
        1712
      ],
      "id": "f410abc2-68c8-45a9-a674-fa3492b1fb9f",
      "name": "Merge",
      "executeOnce": false,
      "alwaysOutputData": false
    },
    {
      "parameters": {
        "url": "={{ $json.url_anexo.replace('http:///rails', 'http://76.13.164.208:3000') }}",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -3120,
        1696
      ],
      "id": "e4c8e4ed-53dd-468c-91c5-75bff07651ca",
      "name": "Download Documento",
      "credentials": {
        "httpHeaderAuth": {
          "id": "Fywlx3sq0hc1Ndqz",
          "name": "Header Auth account"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "622fffc2-fe00-4523-9b07-1289780a67cc",
              "name": "mimeType",
              "value": "=  {{ (() => { const url = $json.url_anexo || ''; const fileName = $json.fileName || ''; if (url.toLowerCase().includes('.pdf') || fileName.toLowerCase().endsWith('.pdf')) { return 'application/pdf'; } if (url.toLowerCase().includes('.png') || fileName.toLowerCase().endsWith('.png')) { return 'image/png'; } if (url.toLowerCase().includes('.jpg') || url.toLowerCase().includes('.jpeg') || fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.jpeg')) { return 'image/jpeg'; } if (url.toLowerCase().includes('.webp') || fileName.toLowerCase().endsWith('.webp')) { return 'image/webp'; } return 'image/jpeg'; })() }}",
              "type": "string"
            },
            {
              "id": "cf9586ba-73a7-4820-9352-878b4ae35f3b",
              "name": "tipoDetectado",
              "value": "={{ (() => { const url = $json.url_anexo || ''; if (url.toLowerCase().includes('.pdf')) return 'PDF'; return 'Imagem'; })() }}",
              "type": "string"
            }
          ]
        },
        "includeOtherFields": true,
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -2944,
        1696
      ],
      "id": "2a5c097c-6b8d-4916-b63b-7dd74240fcfb",
      "name": "Detectar tipo de arquivo"
    },
    {
      "parameters": {
        "resource": "image",
        "operation": "analyze",
        "modelId": {
          "__rl": true,
          "value": "models/gemini-2.5-flash",
          "mode": "list",
          "cachedResultName": "models/gemini-2.5-flash"
        },
        "text": "Extraia dados do comprovante financeiro. Identifique: Tipo (PIX/Boleto/Nota), Valor (R$), Data (DD/MM/YYYY), Destinatário/Fornecedor, Descrição. Verifique tambem de qual banco estamos foi feito e se ha alguma referencia sobre o cartão. Retorne apenas os dados extraídos, sem comentários adicionais.",
        "inputType": "binary",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.googleGemini",
      "typeVersion": 1.1,
      "position": [
        -2480,
        1712
      ],
      "id": "8a5603d5-82d3-46c1-bac4-4555b75d24fa",
      "name": "Analyze an image",
      "credentials": {
        "googlePalmApi": {
          "id": "vHo1toRdC1COEXI3",
          "name": "Google Gemini(PaLM) Api account"
        }
      }
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT \n    org_id, \n    org_name, \n    status, \n    trial_ends_at, \n    daily_message_limit, \n    messages_used_today, \n    features_enabled \nFROM phone_to_org \nWHERE \n    -- Limpa tudo que não é número e compara\n    REGEXP_REPLACE(phone_number, '\\D','','g') = REGEXP_REPLACE($1, '\\D','','g')\nLIMIT 1;",
        "options": {
          "queryReplacement": "={{ $('Info').item.json.telefone }}"
        }
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        -1280,
        1360
      ],
      "id": "f04f67f3-6a7f-4b32-a234-5feef25cbdf5",
      "name": "Buscar Org ID",
      "alwaysOutputData": true,
      "credentials": {
        "postgres": {
          "id": "yZ0x55N1R2A3pz0r",
          "name": "Postgres João.ai"
        }
      }
    },
    {
      "parameters": {
        "content": "# Processando de Imagem e PDF",
        "height": 340,
        "width": 1080,
        "color": 3
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        -3296,
        1584
      ],
      "id": "1a70faea-dc96-44a9-8f69-f96491665bd8",
      "name": "Sticky Note10"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Info').item.json.url_chatwoot }}/api/v1/accounts/{{ $('Info').item.json.id_conta }}/conversations/{{ $('Info').item.json.id_conversa }}/toggle_typing_status",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "typing_status",
              "value": "={{ $('Info').item.json.mensagem_de_audio ? 'recording' : 'on' }}"
            }
          ]
        },
        "options": {
          "response": {
            "response": {
              "responseFormat": "text"
            }
          }
        }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -1824,
        1360
      ],
      "id": "87c735bc-d4ac-4f0a-9afc-96c165ba71f4",
      "name": "Digitando/Gravando...",
      "alwaysOutputData": false,
      "credentials": {
        "httpHeaderAuth": {
          "id": "Uu2idpJ4OzVCCTJG",
          "name": "ChatWoot_Joaoai"
        }
      }
    },
    {
      "parameters": {
        "content": "# TRATAR USUÁRIO",
        "height": 300,
        "width": 804,
        "color": 5
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        -1392,
        1264
      ],
      "id": "dca2365d-3e24-4dd9-a6d6-d916d3cabaff",
      "name": "Sticky Note13"
    },
    {
      "parameters": {
        "content": "# Agente João.ai\n",
        "height": 524,
        "width": 2976,
        "color": 3
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        1024,
        608
      ],
      "id": "7c2cb460-2a0c-446a-9c3e-4d7574dbac0c",
      "name": "Sticky Note7"
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "={{ $('Info').first().json.telefone }}",
        "tableName": "n8n_historico_mensagens",
        "contextWindowLength": 15
      },
      "type": "@n8n/n8n-nodes-langchain.memoryPostgresChat",
      "typeVersion": 1.3,
      "position": [
        1232,
        928
      ],
      "id": "e1b55131-c927-4549-adea-0c8cc3fcea6d",
      "name": "Memory",
      "credentials": {
        "postgres": {
          "id": "yZ0x55N1R2A3pz0r",
          "name": "Postgres João.ai"
        }
      }
    },
    {
      "parameters": {
        "description": "Use a ferramenta para refletir sobre algo. Ela não obterá novas informações nem alterará o banco de dados, apenas adicionará o pensamento ao registro. Use-a quando for necessário um raciocínio complexo ou alguma memória em cache."
      },
      "type": "@n8n/n8n-nodes-langchain.toolThink",
      "typeVersion": 1,
      "position": [
        1344,
        928
      ],
      "id": "bffb76cb-5386-4094-a3b7-490d72fe7c8e",
      "name": "Refletir"
    },
    {
      "parameters": {
        "model": {
          "__rl": true,
          "value": "gpt-5-mini",
          "mode": "list",
          "cachedResultName": "gpt-5-mini"
        },
        "builtInTools": {},
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.3,
      "position": [
        1088,
        928
      ],
      "id": "3560d781-83a7-4cec-a6cf-c1dcb1c9439a",
      "name": "OpenAI Chat Model",
      "credentials": {
        "openAiApi": {
          "id": "vKBno59QWhuUp1sz",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "toolDescription": "Use esta ferramenta para reagir à mensagem do usuário. Argumento 'content': Use '👍' para confirmações rápidas ou '💙' (coração azul) para agradecimentos e empatia.",
        "method": "POST",
        "url": "={{ $('Info').first().json.url_chatwoot }}/api/v1/accounts/{{ $('Info').first().json.id_conta }}/conversations/{{ $('Info').first().json.id_conversa }}/messages",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "content",
              "value": "={{ $fromAI(\"content\", \"O emoji para reagir\", \"string\") }}"
            },
            {
              "name": "content_attributes",
              "value": "={{ { \"in_reply_to\": $('Info').first().json.id_mensagem, \"is_reaction\": true } }}"
            },
            {
              "name": "message_type",
              "value": "outgoing"
            },
            {
              "name": "private",
              "value": "false"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequestTool",
      "typeVersion": 4.3,
      "position": [
        1472,
        928
      ],
      "id": "50f5bbc6-0469-4390-a219-dd5aaf00d490",
      "name": "Reagir Mensagem Whatspp",
      "credentials": {
        "httpHeaderAuth": {
          "id": "Uu2idpJ4OzVCCTJG",
          "name": "ChatWoot_Joaoai"
        }
      }
    },
    {
      "parameters": {
        "toolDescription": "Use esta ferramenta para reagir à mensagem do usuário. Argumento 'content': Use '👍' para confirmações rápidas ou '💙' (coração azul) para agradecimentos e empatia.",
        "method": "POST",
        "url": "={{ $('Info').item.json.url_chatwoot }}/api/v1/accounts/{{ $('Info').item.json.id_conta }}/conversations/{{ $('Info').item.json.id_conversa }}/messages",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "parametersBody": {
          "values": [
            {
              "name": "content"
            },
            {
              "name": "content_attributes",
              "valueProvider": "fieldValue",
              "value": "={{ { \"in_reply_to\": $('Info').item.json.id_mensagem, \"is_reaction\": true } }}"
            },
            {
              "name": "message_type",
              "valueProvider": "fieldValue",
              "value": "outgoing"
            },
            {
              "name": "private",
              "valueProvider": "fieldValue",
              "value": "false"
            }
          ]
        }
      },
      "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
      "typeVersion": 1.1,
      "position": [
        624,
        2240
      ],
      "id": "8310824e-bb12-4fe8-9011-e8eea6d46b7f",
      "name": "Reagir Leo",
      "credentials": {
        "httpHeaderAuth": {
          "id": "Uu2idpJ4OzVCCTJG",
          "name": "ChatWoot_Joaoai"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "input_final_fix",
              "name": "input",
              "value": "={{ $json.mensagem || $json.mensagem_audio || ($('Analyze an image').isExecuted ? $('Analyze an image').first().json.content.parts[0].text : '') }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -144,
        2064
      ],
      "id": "fa7a5ec9-78f3-41a7-be83-129478f95bb4",
      "name": "Filtro Mensagem"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "uuid-gen",
              "name": "novo_org_id",
              "value": "={{ 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); }) }}",
              "type": "string"
            },
            {
              "id": "date-calc",
              "name": "data_fim_trial",
              "value": "={{ $now.plus({days: 7}).toISO() }}",
              "type": "string"
            }
          ]
        },
        "includeOtherFields": true,
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -272,
        2064
      ],
      "id": "5d07daa3-80ff-4e09-9a13-c71d5de8b8e8",
      "name": "Preparar Trial"
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "7b9ddcc1-0d2c-4e7d-8689-0a1d1c2437f4",
                    "leftValue": "={{ $json.status }}",
                    "rightValue": "active",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  },
                  {
                    "id": "trial_check",
                    "leftValue": "={{ $json.status }}",
                    "rightValue": "trial",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "or"
              },
              "renameOutput": true,
              "outputKey": "Ativo"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "bb2919e3-0805-4963-9198-cbc82f77e09e",
                    "leftValue": "={{ $json.status }}",
                    "rightValue": "inactive",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  },
                  {
                    "id": "suspended_check",
                    "leftValue": "={{ $json.status }}",
                    "rightValue": "suspended",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  },
                  {
                    "id": "expired_check",
                    "leftValue": "={{ $json.status }}",
                    "rightValue": "expired",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "or"
              },
              "renameOutput": true,
              "outputKey": "Inativo"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "9dd16c55-8b77-46a4-bbb5-e76257601900",
                    "leftValue": "={{ $json.status }}",
                    "rightValue": "new_lead",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  },
                  {
                    "id": "empty_check",
                    "leftValue": "={{ $json.status }}",
                    "rightValue": "",
                    "operator": {
                      "type": "string",
                      "operation": "isEmpty"
                    }
                  }
                ],
                "combinator": "or"
              },
              "renameOutput": true,
              "outputKey": "Novo"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3.2,
      "position": [
        -848,
        1344
      ],
      "id": "e058e6ff-1583-48d9-bc4e-27d5ad0678d7",
      "name": "Roteamento por Status"
    },
    {
      "parameters": {
        "description": "Use a ferramenta para refletir sobre algo. Ela não obterá novas informações nem alterará o banco de dados, apenas adicionará o pensamento ao registro. Use-a quando for necessário um raciocínio complexo ou alguma memória em cache."
      },
      "type": "@n8n/n8n-nodes-langchain.toolThink",
      "typeVersion": 1,
      "position": [
        512,
        2240
      ],
      "id": "44c0ae77-f9d2-45b6-acd4-edf0c6d63062",
      "name": "Refletir Léo"
    },
    {
      "parameters": {
        "model": {
          "__rl": true,
          "value": "gpt-5-mini",
          "mode": "list",
          "cachedResultName": "gpt-5-mini"
        },
        "builtInTools": {},
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.3,
      "position": [
        272,
        2240
      ],
      "id": "1a88fe45-4349-4f5d-9c6b-98c11c05d83f",
      "name": "GPT - Léo",
      "credentials": {
        "openAiApi": {
          "id": "vKBno59QWhuUp1sz",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "={{ $('Apenas Mensagem').item.json.extracted_phone }}",
        "tableName": "n8n_historico_mensagens",
        "contextWindowLength": 50
      },
      "type": "@n8n/n8n-nodes-langchain.memoryPostgresChat",
      "typeVersion": 1.3,
      "position": [
        400,
        2240
      ],
      "id": "326e5f72-1aaf-4251-97be-e815266faeb9",
      "name": "Memory - Léo",
      "credentials": {
        "postgres": {
          "id": "yZ0x55N1R2A3pz0r",
          "name": "Postgres João.ai"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Info').item.json.url_chatwoot }}/api/v1/accounts/{{ $('Info').item.json.id_conta }}/conversations/{{ $('Info').item.json.id_conversa }}/messages",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "content",
              "value": "={{ $json.output }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1520,
        2080
      ],
      "id": "421d8741-0f09-45bd-8e6e-20a9b4eab1ab",
      "name": "Responder (Léo)",
      "credentials": {
        "httpHeaderAuth": {
          "id": "Uu2idpJ4OzVCCTJG",
          "name": "ChatWoot_Joaoai"
        }
      }
    },
    {
      "parameters": {
        "content": "## AGENTE SRD - LÉO",
        "height": 448,
        "width": 2112
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        -336,
        1984
      ],
      "typeVersion": 1,
      "id": "83f72861-7e5e-4a0e-a575-9b9268d54808",
      "name": "Sticky Note1"
    },
    {
      "parameters": {
        "jsCode": "// 1. Pega a resposta completa que o Léo gerou\nconst textoCompleto = $input.item.json.output || '';\n\n// 2. Fatia o texto onde encontrar \"|||\"\n// Se o Léo mandou: \"Oi ||| Tudo bem?\", vira uma lista: [\"Oi\", \"Tudo bem?\"]\nconst pedacos = textoCompleto.split('|||');\n\n// 3. Prepara para o n8n enviar um por um\nreturn pedacos\n  .map(pedaco => pedaco.trim()) // Remove espaços vazios no começo/fim\n  .filter(pedaco => pedaco.length > 0) // Garante que não tem mensagem vazia\n  .map(pedaco => {\n    return {\n      json: {\n        output: pedaco // Entrega cada pedaço separadamente\n      }\n    };\n  });"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        768,
        2064
      ],
      "id": "6d97792a-4a10-45b6-9026-823544c59fc6",
      "name": "Quebrar Mensagens"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [
        1024,
        2064
      ],
      "id": "fdab96f7-0081-49e5-bf06-d7f613a59e7e",
      "name": "Loop Over Items"
    },
    {
      "parameters": {
        "amount": 1.5
      },
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        1264,
        2080
      ],
      "id": "422b0af3-1f1a-452b-91f7-832314d087eb",
      "name": "Wait",
      "webhookId": "fd7e1d77-c7ab-4fc0-aa26-4f2269983f33"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [
        3200,
        912
      ],
      "id": "93dc352a-e4cd-4ce9-8ae1-6bea47b152db",
      "name": "Loop Resposta"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Info').first().json.url_chatwoot }}/api/v1/accounts/{{ $('Info').first().json.id_conta }}/conversations/{{ $('Info').first().json.id_conversa }}/messages",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "content",
              "value": "={{ $json.output }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        3616,
        928
      ],
      "id": "59191349-9600-4e10-be30-6fbf29f63e44",
      "name": "Responder usuário (Loop)",
      "credentials": {
        "httpHeaderAuth": {
          "id": "Uu2idpJ4OzVCCTJG",
          "name": "ChatWoot_Joaoai"
        }
      }
    },
    {
      "parameters": {
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "n8n_ai_audit_logs",
          "mode": "list"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "org_id": "={{ $('Set mensagens1').first().json.org_id }}",
            "telefone": "={{ $('Info').first().json.telefone }}",
            "input_usuario": "=={{ $('Set mensagens1').first().json.mensagem }}",
            "output_agente": "={{ $json.output }}",
            "metadata": "={{ JSON.stringify($json.responseMetadata || {}) }}"
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": false,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "org_id",
              "displayName": "org_id",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "telefone",
              "displayName": "telefone",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "input_usuario",
              "displayName": "input_usuario",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "output_agente",
              "displayName": "output_agente",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "metadata",
              "displayName": "metadata",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "object",
              "canBeUsedToMatch": true
            },
            {
              "id": "created_at",
              "displayName": "created_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        2976,
        704
      ],
      "id": "74137312-89a4-4964-adfc-ce410b9209fb",
      "name": "Log de Auditoria IA",
      "credentials": {
        "postgres": {
          "id": "yZ0x55N1R2A3pz0r",
          "name": "Postgres João.ai"
        }
      }
    },
    {
      "parameters": {
        "content": "# Tratar Mensagem\n\n",
        "height": 284,
        "width": 1104,
        "color": 3
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        720,
        80
      ],
      "id": "2c941cbb-b5ee-447a-a23a-caf362f482eb",
      "name": "Sticky Note9"
    },
    {
      "parameters": {
        "toolDescription": "Use para listar categorias de gastos/receitas disponíveis para este usuário.",
        "url": "=https://hktcosudbmvqjmallyyl.supabase.co/rest/v1/categories?org_id=eq.{{ $('Set mensagens1').first().json.org_id }}&is_active=eq.true&select=id,name,type",
        "sendHeaders": true,
        "parametersHeaders": {
          "values": [
            {
              "name": "Authorization",
              "valueProvider": "fieldValue",
              "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucmFoZWVyZ3d3aXZkYWR5bmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE1NTI2MywiZXhwIjoyMDgzNzMxMjYzfQ.mWWVj9B5j8wPhh9G_UlulFT6U2KR1_xqnYpp4WVWg5E"
            },
            {
              "name": "apikey",
              "valueProvider": "fieldValue",
              "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucmFoZWVyZ3d3aXZkYWR5bmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE1NTI2MywiZXhwIjoyMDgzNzMxMjYzfQ.mWWVj9B5j8wPhh9G_UlulFT6U2KR1_xqnYpp4WVWg5E"
            }
          ]
        }
      },
      "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
      "typeVersion": 1.1,
      "position": [
        2368,
        928
      ],
      "id": "33128d6d-7207-4ff0-9f27-a7bec281afff",
      "name": "Buscar Categorias"
    },
    {
      "parameters": {
        "descriptionType": "manual",
        "toolDescription": "=Use para EDITAR um lançamento existente pelo código (#). O `code` é um inteiro positivo (ex: 1048). Extraia da mensagem do usuário removendo o caractere `#`.\n\nREGRAS:\n- SÓ chame esta ferramenta se o usuário mencionou EXPLICITAMENTE um #código, OU se o código veio da resposta de um Lancar anterior nesta conversa.\n- NUNCA chame após uma pergunta de categoria/confirmação pré-criação — nesse caso o fluxo é CRIAR (Lancar), não editar.\n- SEMPRE chame Buscar_Lancamento ANTES para confirmar que o código existe e obter os valores atuais.\n- Envie APENAS os campos que o usuário quer mudar. Para os demais, envie o valor atual obtido via Buscar_Lancamento (não deixe vazio ou o banco vai sobrescrever com NULL).\n",
        "operation": "update",
        "tableId": "transactions",
        "filters": {
          "conditions": [
            {
              "keyName": "code",
              "condition": "eq",
              "keyValue": "={{ String($fromAI('code', 'Código do lançamento (apenas números, ex: 1048 ou 0090)', 'string')).replace(/\\D/g,'').padStart(4, '0') }}\n"
            }
          ]
        },
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "description",
              "fieldValue": "={{ $fromAI(\"description\", \"Nova descrição\", \"string\", true) }}"
            },
            {
              "fieldId": "amount",
              "fieldValue": "={{ $fromAI(\"amount\", \"Novo valor numérico\", \"number\") }}"
            },
            {
              "fieldId": "status",
              "fieldValue": "={{ $fromAI(\"status\", \"PAID ou PENDING. Se não mudar, envie o status atual\", \"string\") }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabaseTool",
      "typeVersion": 1,
      "position": [
        1840,
        928
      ],
      "id": "88dc4ace-d875-456b-a815-dba04ac40836",
      "name": "Editar_Lancamento",
      "credentials": {
        "supabaseApi": {
          "id": "7CklUdEsm81GLmfi",
          "name": "Supabase Joaoai"
        }
      }
    },
    {
      "parameters": {
        "descriptionType": "manual",
        "toolDescription": "Use para EXCLUIR permanentemente um lançamento financeiro pelo código (#). O `code` é um inteiro positivo (ex: 1048).\n\nREGRAS:\n- SÓ chame esta ferramenta se o usuário mencionou EXPLICITAMENTE um #código.\n- SEMPRE chame Buscar_Lancamento ANTES para confirmar que o código existe e mostrar os dados ao usuário.\n- SEMPRE obtenha confirmação do usuário antes de executar (\"Quer mesmo excluir?\"). Qualquer resposta afirmativa (sim, pode, confirmo, isso, ok) basta — não exija que o usuário digite \"excluir #XXXX\".\n- A exclusão é permanente, sem backup.\n\nCAMPO OBRIGATÓRIO:\n- code: inteiro numérico extraído da mensagem do usuário (remova `#` e zeros à esquerda).\n",
        "operation": "delete",
        "tableId": "transactions",
        "filters": {
          "conditions": [
            {
              "keyName": "code",
              "condition": "eq",
              "keyValue": "={{ String($fromAI('code', 'Código do lançamento (apenas números, ex: 1048 ou 0090)', 'string')).replace(/\\D/g,'').padStart(4, '0') }}\n"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabaseTool",
      "typeVersion": 1,
      "position": [
        2000,
        928
      ],
      "id": "c179a6fc-4292-42c7-ac67-87322137b1c4",
      "name": "Excluir_Lancamento",
      "credentials": {
        "supabaseApi": {
          "id": "7CklUdEsm81GLmfi",
          "name": "Supabase Joaoai"
        }
      }
    },
    {
      "parameters": {
        "toolDescription": "Use esta ferramenta quando o usuário informar NOME e EMAIL. O telefone está disponível no campo extracted_phone do contexto da conversa — passe-o automaticamente sem pedir ao usuário.",
        "method": "POST",
        "url": "https://hktcosudbmvqjmallyyl.supabase.co/auth/v1/admin/users",
        "sendHeaders": true,
        "parametersHeaders": {
          "values": [
            {
              "name": "Authorization",
              "valueProvider": "fieldValue",
              "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucmFoZWVyZ3d3aXZkYWR5bmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE1NTI2MywiZXhwIjoyMDgzNzMxMjYzfQ.mWWVj9B5j8wPhh9G_UlulFT6U2KR1_xqnYpp4WVWg5E"
            },
            {
              "name": "apikey",
              "valueProvider": "fieldValue",
              "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucmFoZWVyZ3d3aXZkYWR5bmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE1NTI2MywiZXhwIjoyMDgzNzMxMjYzfQ.mWWVj9B5j8wPhh9G_UlulFT6U2KR1_xqnYpp4WVWg5E"
            },
            {
              "name": "Content-Type",
              "valueProvider": "fieldValue",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\"email\":\"{email}\",\"password\":\"mudar123\",\"email_confirm\":true,\"user_metadata\":{\"name\":\"{company_name}\",\"phone\":\"{phone}\"}}",
        "placeholderDefinitions": {
          "values": [
            {
              "name": "email",
              "description": "Email informado pelo usuário",
              "type": "string"
            },
            {
              "name": "company_name",
              "description": "Nome da empresa informado pelo usuário",
              "type": "string"
            },
            {
              "name": "phone",
              "description": "Telefone do usuário, usar o valor de extracted_phone do contexto",
              "type": "string"
            }
          ]
        }
      },
      "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
      "typeVersion": 1.1,
      "position": [
        768,
        2240
      ],
      "id": "e8964633-6710-4347-813f-a96263344bc1",
      "name": "Criar Conta Trial1"
    },
    {
      "parameters": {
        "jsCode": "// 1. Pega o texto da mensagem\nconst text = $input.item.json.input || $input.item.json.clean_input || '';\n\n// 2. TELEFONE - Direto do nó Info\nconst phone = $('Info').first().json.telefone || 'sem_telefone';\n\n// 3. E-MAIL - Extrai da mensagem\nconst emailMatch = text.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}/);\nconst email = emailMatch ? emailMatch[0] : null;\n\n// 4. NOME - Extrai da mensagem\nlet company = null;\n\n// Tenta \"Nome: X\" ou \"Meu nome é X\"\nconst nameMatch = text.match(/(?:Nome|Meu nome é|Me chamo):\\s*([^\\n,]+)/i);\nif (nameMatch) {\n  company = nameMatch[1].trim();\n}\n\n// Se não achou, tenta pegar nome próprio (2 palavras com maiúscula)\nif (!company) {\n  const simpleNameMatch = text.match(/([A-Z][a-z]+\\s+[A-Z][a-z]+)/);\n  if (simpleNameMatch) {\n    company = simpleNameMatch[1];\n  }\n}\n\n// Fallback\nif (!company) {\n  company = 'Empresa (Sem Nome)';\n}\n\n// Retorna tudo\nreturn {\n  extracted_email: email,\n  extracted_company: company,\n  extracted_phone: phone,\n  clean_input: text\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        32,
        2064
      ],
      "id": "f492c601-459b-460c-9ee4-e39908b85349",
      "name": "Extrair Dados (JS)1"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "msg_input",
              "name": "input",
              "value": "={{ $json.clean_input }}",
              "type": "string"
            },
            {
              "id": "keep_phone",
              "name": "extracted_phone",
              "value": "={{ $json.extracted_phone }}",
              "type": "string"
            },
            {
              "id": "keep_company",
              "name": "extracted_company",
              "value": "={{ $json.extracted_company }}",
              "type": "string"
            },
            {
              "id": "keep_email",
              "name": "extracted_email",
              "value": "={{ $json.extracted_email }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        208,
        2064
      ],
      "id": "8b898630-8ab4-4211-ae07-14409453a523",
      "name": "Apenas Mensagem"
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.clean_input }} Para: {{ $json.input }}",
        "options": {
          "systemMessage": "=# 💙 ASSISTENTE DE BOAS-VINDAS JOÃO.AI\n\n## 🎭 QUEM É VOCÊ\n\nVocê é o **João**, assistente de boas-vindas do **João.ai** - um app de finanças pessoais pelo WhatsApp.\n\n### Sua Missão\nAjudar novos usuários a começar a usar o app de forma simples e rápida.\n\n### O Que Você Faz\n- ✅ Apresentar o João.ai\n- ✅ Coletar nome e e-mail para criar conta\n- ✅ **CRIAR conta de teste (7 dias grátis) usando a ferramenta**\n- ✅ Explicar como funciona\n\n### O Que Você NÃO Faz\n- ❌ Registrar gastos ou receitas\n- ❌ Processar comprovantes\n- ❌ Acessar dados financeiros\n\n---\n\n## 🛠️ FERRAMENTA: Criar_Conta_Trial1\n\n### Quando Usar\nUse a ferramenta **IMEDIATAMENTE** quando:\n- ✅ Usuário demonstra interesse (\"quero testar\", \"criar conta\", \"trial\")\n- ✅ Você tem **nome** E **e-mail** do usuário\n\n### Como Usar (CRÍTICO!)\n\nA ferramenta exige 2 parâmetros que VOCÊ deve extrair da conversa:\n\n**1. email** (string)\n- Extraia o e-mail da mensagem do usuário\n- Exemplo: \"joao@teste.com\"\n\n**2. company_name** (string)\n- Extraia o nome completo ou nome da empresa\n- Exemplo: \"João Silva\" ou \"Empresa X\"\n\n> ⚠️ O **telefone** é pego automaticamente pelo sistema. Você NÃO precisa extrair nem informar o telefone.\n\n### Exemplos de Extração\n\n**Exemplo 1:**\n```\nMensagem: \"Quero testar! Meu nome é Pamela Brenda, email pamela@uorak.com\"\n\nExtrair:\n- company_name = \"Pamela Brenda\"\n- email = \"pamela@uorak.com\"\n\n→ Chamar ferramenta imediatamente!\n```\n\n**Exemplo 2:**\n```\nMensagem: \"Nome: João Silva Email: joao@teste.com\"\n\nExtrair:\n- company_name = \"João Silva\"\n- email = \"joao@teste.com\"\n\n→ Chamar ferramenta imediatamente!\n```\n\n### ⚠️ REGRAS IMPORTANTES\n\n**SEMPRE:**\n- Se tem nome + email → **EXECUTE a ferramenta IMEDIATAMENTE**\n- Não peça confirmação, EXECUTE diretamente\n- Após sucesso → Mostre credenciais\n\n**SE FALTAR DADOS:**\n- Falta nome? → Peça: \"Qual seu nome?\"\n- Falta email? → Peça: \"Qual seu e-mail?\"\n- Tem ambos? → **EXECUTE A FERRAMENTA!**\n\n**NUNCA:**\n- Não fique só conversando sem executar\n- Não peça dados que já tem\n- Não invente email ou nome\n\n---\n\n## 📱 COMUNICAÇÃO\n\n### Cabeçalho Obrigatório\nTodas as mensagens começam com:\n```\n💙 João.ai - Boas-Vindas\n\n[sua mensagem]\n```\n\n### Tom de Voz\n- Amigável e acolhedor\n- Direto e objetivo\n- Sem robotização\n- Focado em AÇÃO, não conversa\n\n---\n\n🫧 CONTROLE DE RITMO (MENSAGENS FRACIONADAS)\nSempre que sua resposta tiver mais de um parágrafo ou ideia distinta, divida-a usando EXATAMENTE o separador ||| (três barras verticais).\nIsso fará com que o WhatsApp envie em balões separados, ficando mais natural.\n\nExemplo:\n💙 João.ai - Boas-Vindas\n\n🎉 Prontinho! Sua conta foi criada!\n\nAbaixo os dados de acesso:\n\n📧 E-mail: pamela@uorak.com\n🔑 Senha: mudar123\n|||\n\n💙 Você agora tambem tem acesso ao portal, basta acessar tanto pelo celular quanto pelo computador:\n\n🔗 Link: https://joaoai.app/login\n|||\n\n✅ Agora você pode começar a anotar seus gastos!\n\nÉ só mandar mensagem tipo:\n- \"Gastei 50 no mercado\"\n- \"Recebi 3000 de salário\"\n- Ou manda um comprovante!\n\nVou organizar tudo pra você! 💙\n\n---\n\n## 💬 FLUXOS DE CONVERSA\n\n### 1️⃣ Primeira Mensagem (Apresentação)\n\n**Você:**\n```\n💙 João.ai - Boas-Vindas\n\nOi! 😊 Seja bem-vindo ao João.ai!\n\nA gente te ajuda a organizar suas finanças pessoais de um jeito simples, tudo pelo WhatsApp.\n|||\nÉ só mandar \"gastei 50 no mercado\" que a gente anota tudo automaticamente!\n|||\nQuer testar 7 dias grátis? Me passa seu nome e e-mail que eu crio sua conta agora! 🚀\n```\n\n---\n\n### 2️⃣ Usuário Demonstra Interesse (Faltam Dados)\n\n**Usuário:** Quero testar!\n\n**Você:**\n```\n💙 João.ai - Boas-Vindas\n\nÓtimo! 🎉\n\nPara criar sua conta trial de 7 dias, preciso de:\n- Seu nome completo\n- Seu e-mail\n\nPode me passar?\n```\n\n---\n\n### 3️⃣ Usuário Fornece Dados Completos (EXECUTAR!)\n\n**Usuário:** Meu nome é Pamela Brenda, email pamela@uorak.com\n\n**Você:**\n```\n[EXTRAIR]\ncompany_name = \"Pamela Brenda\"\nemail = \"pamela@uorak.com\"\n\n[EXECUTAR FERRAMENTA IMEDIATAMENTE]\nCriar_Conta_Trial1(email, company_name)\n\n[APÓS SUCESSO DA FERRAMENTA]\n💙 João.ai - Boas-Vindas\n\n🎉 Prontinho! Sua conta foi criada!\n\n✅ Agora não tem mais volta, sua organização financeira mudou para sempre 👏\n\nÉ só me mandar...\n- \"Gastei 50 no mercado\"\n- \"Recebi 3000 de salário\"\n- Ou manda um comprovante!\n\nPode ser áudio, foto, pdf. Fique a vontade! Vou organizar tudo pra você! 💙\n|||\n\n💙 Você agora tambem tem acesso ao portal João App, você pode acessar tanto pelo celular, quanto pelo computador.\nAbaixo os dados de acesso:\n\n🔗 Link: https://joaoai.app/login\n📧 E-mail: pamela@uorak.com\n🔑 Senha: mudar123\n\n|||\n\nNa plataforma você tem acesso ao Dashboard e gráficos, pode criar categorias, adicionar cartões para controle, bancos etc. Além de fazer comparativos, editar e excluir transações.\n\nEnfim, tudo isso para facilitar seu dia a dia. Bora começar?\n```\n\n---\n\n### 4️⃣ Usuário Fornece Dados Parciais (Pedir o Resto)\n\n**Usuário:** pamela@uorak.com\n\n**Você:**\n```\n💙 João.ai - Boas-Vindas\n\nÓtimo! Já tenho seu e-mail: pamela@uorak.com\n\nAgora só falta seu nome completo. Qual é? 😊\n```\n\n---\n\n**Usuário:** Pamela Brenda\n\n**Você:**\n```\n[EXTRAIR]\ncompany_name = \"Pamela Brenda\"\nemail = \"pamela@uorak.com\" (da mensagem anterior)\n\n[EXECUTAR FERRAMENTA AGORA!]\n```\n\n---\n\n## ✅ CHECKLIST ANTES DE CADA RESPOSTA\n\nAntes de responder, pergunte-se:\n\n1. **Tenho nome + email?**\n   - ✅ SIM → EXECUTE a ferramenta AGORA\n   - ❌ NÃO → Peça o que falta\n\n2. **Usuário demonstrou interesse?**\n   - ✅ SIM → Colete dados ou execute\n   - ❌ NÃO → Apresente o app\n\n3. **A ferramenta foi executada com sucesso?**\n   - ✅ SIM → Mostre credenciais\n   - ❌ NÃO → Tente novamente\n\n---\n\n## 🎯 OBJETIVO FINAL\n\nO usuário deve:\n- ✅ Entender o que é o João.ai\n- ✅ Ter uma conta trial criada\n- ✅ Saber como usar (login + exemplos)\n- ✅ Sentir que foi rápido e fácil\n\n**LEMBRE-SE:**\nSeu trabalho é **EXECUTAR**, não só conversar!\nQuando tiver nome + email → **EXECUTE A FERRAMENTA IMEDIATAMENTE!**\n\nSeja amigável, direto e empático! 💙"
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.9,
      "position": [
        432,
        2064
      ],
      "id": "faf73777-bd94-4c6d-b49a-3eb963862fe6",
      "name": "João - Vendas",
      "retryOnFail": true
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "gpt-4o-mini",
          "mode": "list",
          "cachedResultName": "GPT-4O-MINI"
        },
        "responses": {
          "values": [
            {
              "role": "system",
              "content": "Você é um classificador de transações financeiras pessoais para usuários brasileiros via WhatsApp.\n\nTAREFA: Receber uma mensagem curta e informal do usuário e retornar a categoria mais adequada da lista fornecida.\n\n═══════════════════════════════════\n         INTERPRETAÇÃO DA MENSAGEM\n═══════════════════════════════════\n\nFORMATO COMUM:\n- \"50 uber\", \"mercado 120\", \"recebi 300 do joão\", \"netflix\"\n- Ignore valores numéricos. Foque APENAS nas palavras descritivas.\n\nTOLERÂNCIA A ERROS:\n- Corrija mentalmente erros ortográficos, gírias e abreviações.\n- \"katchup\" = ketchup → comida. \"netflix\" = netflix → streaming. \"gasolima\" = gasolina → combustível.\n- Ignore acentos, maiúsculas/minúsculas, espaços extras.\n\nMENSAGENS AMBÍGUAS COM NOMES DE PESSOAS:\n- \"50 joão\", \"pix maria\" → sem contexto suficiente para categorizar. Confidence baixo.\n- \"almoco com joão\" → o contexto \"almoço\" resolve. Alimentação.\n- \"recebi do joão\" → o verbo \"recebi\" resolve. Renda.\n\n═══════════════════════════════════\n         TIPO: INCOME vs EXPENSE\n═══════════════════════════════════\n\nINCOME (renda): SOMENTE quando houver palavras EXPLÍCITAS de recebimento:\n→ \"recebi\", \"ganhei\", \"entrou\", \"me pagou\", \"me transferiu\", \"salário\", \"freelance recebido\"\n\nEXPENSE (gasto): TODOS os outros casos.\n→ Na dúvida entre INCOME e EXPENSE, SEMPRE assuma EXPENSE.\n\n═══════════════════════════════════\n         DESAMBIGUAÇÃO\n═══════════════════════════════════\n\nQuando duas categorias parecem possíveis:\n1. Priorize o CONTEXTO DE USO (pra que serve?) sobre o LOCAL DE COMPRA (onde comprou?).\n   - \"remédio no mercado\" → Saúde (não Alimentação, porque o produto é remédio).\n   - \"cerveja no bar\" → Alimentação (bebida consumida, não lazer).\n2. Se ainda ambíguo, escolha a categoria MAIS ESPECÍFICA.\n   - \"shampoo\" → Cuidados Pessoais (não Outros).\n3. Se realmente impossível decidir, use a categoria mais provável e reduza confidence.\n\n═══════════════════════════════════\n         CONFIANÇA (confidence)\n═══════════════════════════════════\n\n95-100 → Óbvio, sem qualquer dúvida\n85-94  → Muito provável, mínima ambiguidade\n70-84  → Provável, mas existe alternativa razoável\n40-69  → Chute educado, usuário deve confirmar\n1-39   → Quase impossível, mas existe um palpite\n0      → Nenhuma informação útil na mensagem\n\n═══════════════════════════════════\n         FALLBACK\n═══════════════════════════════════\n\nSe a mensagem NÃO contém nenhuma transação identificável (ex: \"oi\", \"kkk\", \"?\", emojis soltos):\n→ Retorne confidence: 0 e category_name: \"Outros\"\n\nSe a mensagem contém APENAS um nome próprio sem contexto (ex: \"joão\", \"maria\"):\n→ Retorne confidence: 0 e category_name: \"Outros\"\n\n═══════════════════════════════════\n         EXEMPLOS (input → output)\n═══════════════════════════════════\n\nMensagem: \"50 uber\"\n→ {\"category_name\":\"Transporte\",\"category_type\":\"EXPENSE\",\"confidence\":97,\"reasoning\":\"Uber é serviço de transporte\"}\n\nMensagem: \"katchup 12\"\n→ {\"category_name\":\"Alimentação\",\"category_type\":\"EXPENSE\",\"confidence\":90,\"reasoning\":\"Ketchup é condimento alimentar, erro ortográfico corrigido\"}\n\nMensagem: \"recebi 300 do joão\"\n→ {\"category_name\":\"Renda\",\"category_type\":\"INCOME\",\"confidence\":98,\"reasoning\":\"Verbo recebi indica dinheiro entrando\"}\n\nMensagem: \"pix 200 maria\"\n→ {\"category_name\":\"Outros\",\"category_type\":\"EXPENSE\",\"confidence\":25,\"reasoning\":\"Pix enviado para pessoa sem contexto do motivo\"}\n\nMensagem: \"pelada quinta\"\n→ {\"category_name\":\"Lazer\",\"category_type\":\"EXPENSE\",\"confidence\":95,\"reasoning\":\"Pelada é futebol recreativo, forma de lazer\"}\n\nMensagem: \"kkkkk\"\n→ {\"category_name\":\"Outros\",\"category_type\":\"EXPENSE\",\"confidence\":0,\"reasoning\":\"Mensagem não contém transação financeira\"}\n\nMensagem: \"farmacia 85\"\n→ {\"category_name\":\"Saúde\",\"category_type\":\"EXPENSE\",\"confidence\":92,\"reasoning\":\"Farmácia é estabelecimento de saúde\"}\n\nMensagem: \"luz 180\"\n→ {\"category_name\":\"Moradia\",\"category_type\":\"EXPENSE\",\"confidence\":96,\"reasoning\":\"Conta de luz é despesa doméstica\"}\n\nOBS: Nos exemplos acima, os category_name são ilustrativos. Você DEVE usar os nomes e IDs exatos da lista fornecida na mensagem do usuário.\n\n═══════════════════════════════════\n         REGRAS ABSOLUTAS\n═══════════════════════════════════\n\n1. Retorne APENAS JSON puro. Sem markdown (```), sem texto antes ou depois.\n2. O category_id DEVE ser copiado EXATAMENTE da lista fornecida. NUNCA gere um UUID.\n3. NUNCA invente categorias fora da lista.\n4. SEMPRE inclua todos os 5 campos: category_id, category_name, category_type, confidence, reasoning.\n5. O reasoning deve ter NO MÁXIMO 1 frase curta.\n\n═══════════════════════════════════\n         REGRA DE SUBCATEGORIA\n═══════════════════════════════════\n\nA lista contém CATEGORIAS PRINCIPAIS (sem indentação) e SUBCATEGORIAS (com '•' e marcadas como 'subcategoria de X').\n\n- O campo `category_id` deve ser SEMPRE o UUID de uma CATEGORIA PRINCIPAL. NUNCA use UUID de subcategoria aqui.\n- Se houver uma subcategoria que corresponda COM PRECISÃO à transação, inclua também:\n  - `subcategory_id`: UUID da subcategoria escolhida\n  - `subcategory_name`: nome exato da subcategoria\n  - O `category_id` deve ser o UUID da CATEGORIA PAI dessa subcategoria.\n- Se NÃO houver subcategoria precisa, omita os campos `subcategory_id` e `subcategory_name`.\n- Match preciso = a transação se encaixa especificamente naquela subcategoria. Na dúvida, omita.\n\nExemplos:\n  \"mercado 150\" → category_id=UUID(Alimentação), subcategory_id=UUID(Supermercado)\n  \"netflix\" → category_id=UUID(Lazer), subcategory_id=UUID(Cinema/Streaming)\n  \"uber 25\" → category_id=UUID(Transporte), subcategory_id=UUID(Uber/Táxi)\n  \"farmacia 85\" → category_id=UUID(Saúde), subcategory_id=UUID(Farmácia)\n  \"curso de ingles\" → category_id=UUID(Educação), sem subcategory_id se não houver match preciso\n  \"pix 200 maria\" → category_id=UUID(Outros), sem subcategory_id\n\nFORMATO EXATO DE RESPOSTA (com subcategoria):\n{\"category_id\":\"uuid-pai\",\"category_name\":\"Nome do Pai\",\"subcategory_id\":\"uuid-filho\",\"subcategory_name\":\"Nome da Sub\",\"category_type\":\"EXPENSE\",\"confidence\":0,\"reasoning\":\"explicação curta\"}\n\nFORMATO EXATO DE RESPOSTA (sem subcategoria):\n{\"category_id\":\"uuid-pai\",\"category_name\":\"Nome do Pai\",\"category_type\":\"EXPENSE\",\"confidence\":0,\"reasoning\":\"explicação curta\"}"
            },
            {
              "content": "=CATEGORIAS DISPONÍVEIS:\n{{ $json.categorias_consolidadas.filter(c => !c.parent_id).map(p => { const subs = $json.categorias_consolidadas.filter(s => s.parent_id === p.id); const linha = `- ${p.id} | ${p.name} | ${p.type}`; const sub = subs.map(s => `  • ${s.id} | ${s.name} | subcategoria de ${p.name}`).join('\\n'); return sub ? `${linha}\\n${sub}` : linha; }).join('\\n') }}\n\nMENSAGEM PARA CLASSIFICAR:\n={{ $('Set mensagens1').first().json.mensagem }}"
            }
          ]
        },
        "builtInTools": {},
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 2.1,
      "position": [
        1296,
        192
      ],
      "id": "3f4492ca-c51f-4dc5-a4cc-19f405c8c211",
      "name": "Categorizacao",
      "credentials": {
        "openAiApi": {
          "id": "vKBno59QWhuUp1sz",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT \n    id,\n    name,\n    type,\n    parent_id\nFROM categories\nWHERE org_id = $1\n  AND is_active = true\nORDER BY parent_id NULLS FIRST, name;",
        "options": {
          "queryReplacement": "=={{ $json.org_id }}"
        }
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        800,
        192
      ],
      "id": "f39d8d3f-dc50-4d86-ae97-980472d08911",
      "name": "Bucar categoria",
      "credentials": {
        "postgres": {
          "id": "yZ0x55N1R2A3pz0r",
          "name": "Postgres João.ai"
        }
      }
    },
    {
      "parameters": {
        "aggregate": "aggregateAllItemData",
        "destinationFieldName": "categorias_consolidadas",
        "include": "all",
        "options": {}
      },
      "type": "n8n-nodes-base.aggregate",
      "typeVersion": 1,
      "position": [
        1072,
        192
      ],
      "id": "66f9db05-c729-427a-b7c2-4fade9d142f5",
      "name": "Consolidar Categorias"
    },
    {
      "parameters": {
        "jsCode": "// 1. Capturar os dados dos nós anteriores\nconst dadosOrg = $('Roteamento por Status').first().json;\nconst aiResponse = $('Categorizacao').first().json.output[0].content[0].text;\nconst todasCategorias = $('Bucar categoria').all().map(i => i.json);\n\n// 2. Parse robusto do JSON da IA\nlet categorization;\ntry {\n    const cleanJson = aiResponse.replace(/```json\\n?|```\\n?/g, '').trim();\n    categorization = JSON.parse(cleanJson);\n} catch (e) {\n    categorization = { \n        category_id: aiResponse.replace(/[^0-9a-f-]/gi, '').trim(),\n        confidence: 0 \n    };\n}\n\n// 3. Localizar a categoria PRINCIPAL (parent_id null) na lista oficial do banco\nconst idParaBuscar = categorization.category_id;\nlet categoriaSelecionada = todasCategorias.find(c => c.id === idParaBuscar && !c.parent_id);\n\n// FALLBACK: se não achou por ID (ou IA passou subcategoria por engano), tenta por nome em pais\nif (!categoriaSelecionada && categorization.category_name) {\n    categoriaSelecionada = todasCategorias.find(\n        c => !c.parent_id && c.name.toLowerCase() === categorization.category_name.toLowerCase()\n    );\n}\n\n// FALLBACK 2: se IA mandou subcategory por engano em category_id, sobe pro pai\nif (!categoriaSelecionada && idParaBuscar) {\n    const possivelSub = todasCategorias.find(c => c.id === idParaBuscar && c.parent_id);\n    if (possivelSub) {\n        categoriaSelecionada = todasCategorias.find(c => c.id === possivelSub.parent_id);\n    }\n}\n\n// 3b. Localizar a SUBCATEGORIA, validando que pertence à categoria pai escolhida\nlet subcategoriaSelecionada = null;\nif (categorization.subcategory_id && categoriaSelecionada) {\n    const subEncontrada = todasCategorias.find(s => s.id === categorization.subcategory_id && s.parent_id);\n    if (subEncontrada && subEncontrada.parent_id === categoriaSelecionada.id) {\n        subcategoriaSelecionada = subEncontrada;\n    }\n}\n// FALLBACK por nome se id veio errado mas nome veio certo\nif (!subcategoriaSelecionada && categorization.subcategory_name && categoriaSelecionada) {\n    const subEncontrada = todasCategorias.find(\n        s => s.parent_id === categoriaSelecionada.id &&\n             s.name.toLowerCase() === categorization.subcategory_name.toLowerCase()\n    );\n    if (subEncontrada) subcategoriaSelecionada = subEncontrada;\n}\n\n// 4. Lógica de aprovação (Confiança >= 85%)\nconst LIMIAR = 85;\nconst aprovado = (categorization.confidence || 0) >= LIMIAR && categoriaSelecionada;\n\n// 5. Alternativas (top 3 categorias PRINCIPAIS do mesmo tipo, excluindo a escolhida)\nconst tipoInferido = categorization.category_type || 'EXPENSE';\nconst alternativas = todasCategorias\n    .filter(c => !c.parent_id && c.type === tipoInferido && c.id !== (categoriaSelecionada ? categoriaSelecionada.id : ''))\n    .slice(0, 3);\n\n// 6. Montagem do contexto para o João\nconst valorMatch = dadosOrg.mensagem.match(/[\\d.,]+/g);\nconst valorTexto = valorMatch ? 'R$ ' + valorMatch[0] : 'Não identificado';\nconst subInfo = subcategoriaSelecionada ? `\\n📌 Subcategoria: ${subcategoriaSelecionada.name} (ID: ${subcategoriaSelecionada.id})` : '';\n\nconst contexto = aprovado\n    ? `✅ Categoria identificada com confiança alta.\\n💰 Valor: ${valorTexto}\\n📊 Categoria: ${categoriaSelecionada.name} (ID: ${categoriaSelecionada.id})${subInfo}\\n📅 Data: ${new Date().toLocaleDateString('pt-BR')}\\n→ Pode lançar direto.`\n    : `⚠️ Categoria com dúvida.\\n💰 Valor: ${valorTexto}\\n📊 Sugestão: ${categoriaSelecionada ? categoriaSelecionada.name : 'Outros'}${subInfo}\\n📊 Alternativas: ${alternativas.map(a => a.name).join(', ') || 'nenhuma'}\\n📅 Data: ${new Date().toLocaleDateString('pt-BR')}\\n→ Confirme com o usuário antes de lançar.`;\n\nreturn {\n    json: {\n        ...dadosOrg,\n        contexto_financeiro: contexto,\n        inferencia: {\n            aprovado: aprovado,\n            categoria: categoriaSelecionada || null,\n            subcategoria: subcategoriaSelecionada || null,\n            confianca: categorization.confidence || 0,\n            razao: categorization.reasoning || '',\n            alternativas: alternativas\n        }\n    }\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1632,
        192
      ],
      "id": "5eb2ac17-a90f-4105-8df1-cbea09bbe34d",
      "name": "Formatar com categoria"
    },
    {
      "parameters": {
        "toolDescription": "Use para buscar um lançamento financeiro pelo código. O argumento 'code' é o número do lançamento sem # (ex: se usuário disse #0093, envie 0093).",
        "url": "=https://hktcosudbmvqjmallyyl.supabase.co/rest/v1/transactions?code=eq.{code}&org_id=eq.{{ $('Set mensagens1').first().json.org_id }}&select=code,description,amount,type,status,date,category:categories(name)",
        "sendHeaders": true,
        "parametersHeaders": {
          "values": [
            {
              "name": "Authorization",
              "valueProvider": "fieldValue",
              "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucmFoZWVyZ3d3aXZkYWR5bmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE1NTI2MywiZXhwIjoyMDgzNzMxMjYzfQ.mWWVj9B5j8wPhh9G_UlulFT6U2KR1_xqnYpp4WVWg5E"
            },
            {
              "name": "apikey",
              "valueProvider": "fieldValue",
              "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucmFoZWVyZ3d3aXZkYWR5bmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE1NTI2MywiZXhwIjoyMDgzNzMxMjYzfQ.mWWVj9B5j8wPhh9G_UlulFT6U2KR1_xqnYpp4WVWg5E"
            }
          ]
        }
      },
      "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
      "typeVersion": 1.1,
      "position": [
        2192,
        928
      ],
      "id": "29047f44-21a4-4a32-85db-ac5e999ce3ed",
      "name": "Buscar_Lancamento"
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=={{ (() => {\n  const intencao = $json.intencao || 'criar';\n  const nome = $json['Name do usuario'] || '';\n  const msg = $json.mensagem || $json.mensagem_audio || '';\n  const hoje = $now.format('yyyy-MM-dd');\n\n  if (intencao !== 'criar') {\n    return `Intenção: ${intencao.toUpperCase()}\\nData: ${hoje}\\nNome: ${nome}\\nMensagem: ${msg}\\n\\nNÃO lance nova transação. Use a ferramenta apropriada para ${intencao}.`;\n  }\n\n  const catId = $json.inferencia?.categoria?.id || '';\n  const subId = $json.inferencia?.subcategoria?.id || '';\n  const subName = $json.inferencia?.subcategoria?.name || '';\n  const aprovado = !!$json.inferencia?.categoria && ($json.inferencia?.confianca || 0) >= 85;\n\n  const subLinha = subId ? `\\nSUBCATEGORY_ID: ${subId}\\nUSE este p_sub_cat_id ao chamar Lancar: ${subId} (${subName})` : `\\nSUBCATEGORY_ID: (nenhuma — omita p_sub_cat_id no Lancar)`;\n\n  if (!aprovado) {\n    return `⛔ CATEGORIA NÃO APROVADA\\n${$json.contexto_financeiro}\\nData: ${hoje}\\nNome: ${nome}\\nMensagem: ${msg}`;\n  }\n\n  return `${$json.contexto_financeiro || ''}\\nData: ${hoje}\\nNome: ${nome}\\nCATEGORY_ID: ${catId}\\nUSE EXATAMENTE este p_cat_id ao chamar Lancar: ${catId}${subLinha}\\n${msg}`;\n})() }}",
        "options": {
          "systemMessage": "=# JOÃO - ASSISTENTE DE FINANÇAS PESSOAIS\n\nData de hoje: {{ $now.format('yyyy-MM-dd') }}\n{{ $json['Name do usuario'] }}\n\n## IDENTIDADE\nVocê é o João, assistente financeiro pessoal via WhatsApp. Você é executor: age primeiro, conversa depois. Mensagens curtas. WhatsApp não é e-mail.\n\n## REGRA #1: AÇÃO IMEDIATA\nValor + ação financeira detectados → chame `Lancar` IMEDIATAMENTE.\n- \"Gastei 50 no mercado\" → Lancar agora, confirmar depois\n- \"Recebi 3000\" → Lancar agora\n- NUNCA peça confirmação antes de lançar. Ação primeiro.\n\n## REGRA #2: CONTEXTO FINANCEIRO (AÇÃO PRIMEIRO)\n\nVocê recebe automaticamente um `contexto_financeiro` com:\n- `aprovado: true` → categoria definida. Use o `p_cat_id` (UUID) DIRETO do contexto. NÃO passe o nome — só UUID.\n- `aprovado: false` → chame `Buscar Categorias` IMEDIATAMENTE para obter os UUIDs. Depois chame `Lancar` usando o UUID da categoria mais provável (ex: \"Outros\"). Na confirmação, informe a categoria e ofereça troca.\n\n🚨 REGRA CRÍTICA DE UUID:\n- O campo `p_cat_id` do Lancar ACEITA SOMENTE UUIDs no formato `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.\n- NUNCA passe nome (\"outros\", \"alimentação\", etc).\n- Se não tiver o UUID em mãos, SEMPRE chame `Buscar Categorias` antes de `Lancar`.\n- Se nenhuma categoria bate, omita o campo p_cat_id (deixa vazio).\n\n📌 SUBCATEGORIA (`p_sub_cat_id`):\n- Quando o contexto trouxer SUBCATEGORY_ID, passe esse UUID como `p_sub_cat_id` na ferramenta Lancar (junto com o `p_cat_id` do pai).\n- Quando o contexto disser \"nenhuma\", OMITA `p_sub_cat_id` no Lancar (deixe vazio).\n- Na confirmação ao usuário, exiba a subcategoria como complemento da categoria. Ex: `📊 Alimentação · Supermercado`.\n- Se o usuário pedir troca de subcategoria depois (\"muda a sub pra Restaurantes\"), chame `Buscar Categorias` → pegue o UUID da nova subcategoria → `Editar_Lancamento` com `p_sub_cat_id`.\n\nNUNCA pergunte qual categoria antes de lançar. Sempre lance com a sugestão mais provável e ofereça troca.\n\nSe o usuário depois pedir para trocar (\"muda pra Alimentação\"), chame `Buscar Categorias` → pegue UUID → `Editar_Lancamento` com o #código que você acabou de criar.\n\n\n## REGRA #3: LINGUAGEM\n- Traduza TUDO para linguagem cotidiana. Nunca mostre UUIDs, IDs, nomes de campos, ou termos do sistema.\n- Nunca fale sobre código, programação, n8n, JavaScript ou funcionamento interno.\n- Se pedirem ajuda técnica → \"Sou assistente de finanças, não de programação 😅\"\n\n## REGRA #4: FORMATAÇÃO WHATSAPP\n\nCabeçalho obrigatório em TODA mensagem:\n💙 João - Finanças Pessoais\n\nÍcones padrão:\n💰 valor | 📍 local/descrição | 📊 categoria | 🏦 conta | 💳 cartão | 📅 data | 🔢 código | ✅ pago | ⏳ a pagar\n\n⚠️ REGRA DE OURO DOS ÍCONES:\n- Mostre APENAS campos preenchidos\n- NUNCA exiba \"🏦 —\" ou \"💳 —\" ou qualquer campo vazio\n- Se conta/cartão/descrição não informados → omita totalmente essas linhas\n\nCadência — use ||| para quebrar em balões separados:\n- USE quando: confirmação + pergunta, resposta longa (>150 chars), múltiplos contextos\n- NÃO USE quando: resposta curta, confirmação simples, dado único\n- Máximo: 3 blocos (2 separadores) por resposta\n\n## REGRA #5: TOM DE VOZ\n\nSeja natural, caloroso e variado. Nunca repita a mesma frase de confirmação duas vezes seguidas.\n\nDiretrizes:\n- Use o nome do usuário ocasionalmente para personalizar (ex: \"Anotado, Rodrigo!\" ou \"Boa, Rodrigo! 💰\"). Não use em TODA mensagem — alterne entre usar e não usar para soar natural.\n- Confirmações de GASTO: frase curta e positiva que transmita \"anotei, tá controlado\". Use 1 emoji. Seja criativo e varie sempre.\n- Confirmações de RECEITA: frase curta e animada que transmita \"boa, entrou dinheiro!\". Celebre levemente.\n- Tom geral: amigo organizado, não robô corporativo. Fale como gente.\n- NUNCA use a mesma abertura da mensagem anterior. Se disse \"Prontinho!\" agora, diga algo diferente na próxima.\n\n## REGRA #6: LINK DO SITE\nMencione joaoai.vercel.app no segundo bloco (após |||) de forma natural, mas NÃO em toda mensagem. Use a cada 2-3 interações para não parecer spam. Varie a frase quando mencionar.\n\n## REGRA #7: ANTI-LOOP (CRIAR vs EDITAR)\n\nRegras inegociáveis para nunca confundir os fluxos:\n\n1. **Editar_Lancamento SÓ com código existente.** Nunca chame essa ferramenta sem um `#código` que:\n   - veio da resposta de um `Lancar` anterior NESTA conversa, OU\n   - foi mencionado textualmente pelo usuário (ex: \"edita o #1048\").\n   Se não houver código, o fluxo é CRIAR (`Lancar`), não editar.\n\n2. **Pergunta de categoria não existe antes do Lancar.** Você SEMPRE lança primeiro (ver REGRA #2). Se o usuário pedir troca depois, aí sim é `Editar_Lancamento` com o #código gerado.\n\n3. **Código vem da resposta do Lancar.** Após `Lancar` retornar sucesso, extraia o campo `code` da resposta e exiba `🔢 #{code}` na confirmação. NUNCA invente um número. NUNCA peça ao usuário que informe o código que você mesmo deveria ter gerado.\n\n4. **Na dúvida \"criar ou editar?\":** se o usuário NÃO mencionou `#código` explicitamente nesta mensagem, é CRIAR.\n\n5. **Buscar Categorias quando precisar do id:** antes de `Editar_Lancamento` trocando categoria, se você não tem o `id` da nova categoria em mãos, chame `Buscar Categorias`. Não chute UUID.\n\n## QUANDO USAR CADA FERRAMENTA\n\n`Lancar` → usuário menciona valor + gasto/recebimento/compra/pagamento. Único caminho para CRIAR transação.\n\n`Buscar_Lancamento` → usuário menciona código (#) e quer ver, editar ou excluir (SEMPRE busque antes de editar/excluir).\n\n`Editar_Lancamento` → APÓS buscar um lançamento existente por `#código` E saber o que mudar. Ver REGRA #7.\n\n`Excluir_Lancamento` → APÓS buscar um lançamento existente por `#código` E receber confirmação explícita do usuário.\n\n`Buscar Categorias` → usuário pergunta sobre categorias disponíveis OU você precisa do `id` de uma categoria antes de `Editar_Lancamento`.\n\n`Buscar Contas e Cartoes` → usuário pergunta sobre contas ou cartões.\n\n`Reagir_Mensagem` → USE em confirmações e interações relevantes:\n  - Lançamento criado → 💙 ou 👍\n  - \"Obrigado/valeu\" → 💙\n  - \"Perfeito/show\" → 👍\n  - Edição solicitada → ✏️\n  - Edição confirmada → ✅\n  - Exclusão solicitada → ⚠️\n  - Exclusão confirmada → 🗑️\n\n`Refletir` → raciocínio complexo (nunca mencione ao usuário).\n\n## INFERÊNCIAS\n\nTipo:\n- \"paguei/gastei/comprei/saiu\" → EXPENSE\n- \"recebi/entrou/ganhei/me pagou\" → INCOME\n- Na dúvida → EXPENSE\n\nStatus:\n- Padrão → PAID\n- \"vence/a pagar/vai vencer\" → PENDING\n\nData:\n- Não mencionou → hoje (null)\n- \"ontem\" → calcule a data\n- \"dia 10\" → dia 10 do mês atual\n\n## FLUXO: LANÇAR (CRIAR)\n\n### Categoria aprovada (aprovado: true):\n👤: Gastei 7,34 da conta de luz\n🤖:\n[Reagir_Mensagem] → [Lancar imediatamente]\n\n💙 João - Finanças Pessoais\n\n[frase natural de confirmação]\n\n💰 R$ 7,34\n📍 Conta de luz\n📊 Moradia\n📅 Hoje\n✅ Pago\n🔢 #{code retornado pelo Lancar}\n\n### Categoria com dúvida (aprovado: false):\n👤: 89 streaming (sugestão principal do contexto: Lazer)\n🤖:\n[Reagir_Mensagem] → [Lancar com p_cat_id da sugestão principal]\n\n💙 João - Finanças Pessoais\n\nAnotado! ✅\n\n💰 R$ 89,00\n📍 Streaming\n📊 Lazer\n📅 Hoje\n🔢 #{code retornado pelo Lancar}\n\nSe for outra categoria, só me avisar que eu troco 😉\n\n### Trocando categoria depois:\n👤: muda pra Moradia\n🤖:\n[Reagir_Mensagem ✅] → [Buscar Categorias → pegar id de Moradia] → [Editar_Lancamento com code=último #criado + novo p_cat_id]\n\n💙 João - Finanças Pessoais\n\n🔢 #{code} atualizado:\n📊 Moradia (era Lazer)\n\n### Recebimento:\n👤: Recebi 3000 de salário\n🤖:\n[Reagir_Mensagem] → [Lancar]\n\n💙 João - Finanças Pessoais\n\n[frase natural celebrando a entrada]\n\n💰 R$ 3.000,00\n📊 Salário\n📅 Hoje\n🔢 #{code retornado pelo Lancar}\n\n## FLUXO: EDITAR\n\nSó entra neste fluxo se o usuário mencionou EXPLICITAMENTE um `#código` (ex: \"edita o #1034\"), OU se está trocando algo de um lançamento que você acabou de criar nesta conversa.\n\nProcesso OBRIGATÓRIO em etapas:\n1. Usuário menciona `#código` → Reagir_Mensagem (✏️) → `Buscar_Lancamento`\n2. Mostre os dados atuais ao usuário\n3. Pergunte o que quer mudar\n4. Usuário responde → Reagir_Mensagem (✅) → `Editar_Lancamento`\n5. Confirme a alteração mostrando antes/depois\n\n### Exemplo:\n👤: Edita o #1034\n🤖:\n[Reagir_Mensagem ✏️] → [Buscar_Lancamento]\n\n💙 João - Finanças Pessoais\n\nAchei o #1034:\n\n💰 R$ 50,00 📍 Farmácia 📊 Saúde 📅 30/01 ✅ Pago\n|||\n💙 João - Finanças Pessoais\n\nO que quer mudar? 😊\n\n👤: Muda o valor pra 60\n🤖:\n[Reagir_Mensagem ✅] → [Editar_Lancamento]\n\n💙 João - Finanças Pessoais\n\n🔢 #1034 atualizado:\n💰 R$ 60,00 (era R$ 50,00)\n\n## FLUXO: EXCLUIR\n\nSó entra neste fluxo se o usuário mencionou EXPLICITAMENTE um `#código`.\n\n1. Usuário menciona `#código` + exclusão → Reagir_Mensagem (⚠️) → `Buscar_Lancamento`\n2. Mostre os dados e peça confirmação simples: \"Quer mesmo excluir?\"\n3. Usuário confirma → Reagir_Mensagem (🗑️) → `Excluir_Lancamento`\n\n⚠️ REGRAS DE CONFIRMAÇÃO:\n- QUALQUER resposta afirmativa serve: \"sim\", \"pode excluir\", \"confirmo\", \"isso\", \"ok\", \"manda ver\"\n- NÃO exija que o usuário escreva \"excluir #XXXX\" — péssima experiência.\n- Só NÃO exclua se o usuário disser \"não\", \"cancelar\", \"deixa pra lá\" ou mudar de assunto.\n\n### Exemplo:\n👤: Exclui o #0090\n🤖:\n[Reagir_Mensagem ⚠️] → [Buscar_Lancamento]\n\n💙 João - Finanças Pessoais\n\nAchei o 🔢 #0090:\n💰 R$ 19,00 📍 Corte de cabelo 📅 24/02 ✅ Pago\n\nQuer mesmo excluir? ⚠️\n\n👤: Sim\n🤖:\n[Reagir_Mensagem 🗑️] → [Excluir_Lancamento]\n\n💙 João - Finanças Pessoais\n\n🗑️ Removido! O #0090 foi excluído.\n\n## FLUXO: AGRADECIMENTOS\n\n👤: Obrigado! / Valeu! / Brigado!\n🤖: [Reagir_Mensagem 💙] — NÃO enviar mensagem de texto, apenas reagir.\n\n👤: Perfeito! / Show! / Ótimo!\n🤖: [Reagir_Mensagem 👍] — NÃO enviar mensagem de texto, apenas reagir.\n\n## FLUXO: BOAS-VINDAS (primeira mensagem)\n\n💙 João - Finanças Pessoais\n\n[saudação calorosa e natural, se apresente como João]\n|||\n💙 João - Finanças Pessoais\n\n[explique de forma simples o que sabe fazer, dê um exemplo como \"Gastei 50 no mercado\"]\n\n## LEMBRE-SE\nVocê é executor. Usuário fala → Você EXECUTA → Você confirma.\nQuando em dúvida entre conversar ou executar → EXECUTE.\nQuando em dúvida entre criar ou editar → CRIAR (a não ser que haja `#código` explícito).\nQuando em dúvida sobre categoria → LANCE com a sugestão principal e ofereça troca. NUNCA pergunte antes de lançar.\nNUNCA mostre campos vazios!\nNUNCA repita a mesma frase de confirmação!\nMensagens curtas. WhatsApp não é e-mail.\n"
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.9,
      "position": [
        1712,
        704
      ],
      "id": "e76558b7-986f-4ae3-9554-dfa63b2fcabb",
      "name": "Joaoai Inteligencia",
      "retryOnFail": true
    },
    {
      "parameters": {
        "amount": 1.75
      },
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        3408,
        928
      ],
      "id": "7334addf-4a8b-4e76-8754-4a6a2e4db9cf",
      "name": "Delay entre as mensagens",
      "webhookId": "1fda22b0-c159-4a63-b5a9-3515fb11c1e1"
    },
    {
      "parameters": {
        "jsCode": "// 1. MUDANÇA CRÍTICA: Usamos .first() em vez de .item\n// Isso impede que o n8n fique \"girando\" tentando achar a referência.\nlet texto = '';\n\ntry {\n  // Tenta pegar direto da Secretária (o .first() resolve o travamento)\n  texto = $('Joaoai Inteligencia').first().json.output;\n} catch (error) {\n  // Se falhar, tenta pegar do input imediato\n  texto = $json.output;\n}\n\n// 2. BLINDAGEM: Se não tiver texto, retorna vazio para não travar\nif (!texto || typeof texto !== 'string') {\n  return []; \n}\n\n// 3. Lógica de Quebra (|||)\nconst pedacos = texto.includes('|||') ? texto.split('|||') : [texto];\n\n// 4. Formata para o n8n\nreturn pedacos\n  .map(p => p.trim()) // Limpa espaços\n  .filter(p => p.length > 0) // Remove vazios\n  .map(p => {\n    return {\n      json: {\n        output: p\n      }\n    };\n  });"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        2976,
        912
      ],
      "id": "0cf6a11c-182b-4934-bfa2-5ac4ea12fbaf",
      "name": "Quebrar Mensagens1"
    },
    {
      "parameters": {
        "toolDescription": "Use para listar as contas bancárias e cartões de crédito vinculados.",
        "method": "POST",
        "url": "https://hktcosudbmvqjmallyyl.supabase.co/rest/v1/rpc/get_accounts_and_cards",
        "sendHeaders": true,
        "parametersHeaders": {
          "values": [
            {
              "name": "Authorization",
              "valueProvider": "fieldValue",
              "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucmFoZWVyZ3d3aXZkYWR5bmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE1NTI2MywiZXhwIjoyMDgzNzMxMjYzfQ.mWWVj9B5j8wPhh9G_UlulFT6U2KR1_xqnYpp4WVWg5E"
            },
            {
              "name": "apikey",
              "valueProvider": "fieldValue",
              "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucmFoZWVyZ3d3aXZkYWR5bmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE1NTI2MywiZXhwIjoyMDgzNzMxMjYzfQ.mWWVj9B5j8wPhh9G_UlulFT6U2KR1_xqnYpp4WVWg5E"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={ \"p_org_id\": \"$('Set mensagens1').first().json\" }"
      },
      "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
      "typeVersion": 1.1,
      "position": [
        2528,
        928
      ],
      "id": "847e1a46-a473-4296-9a5c-b8227d12c473",
      "name": "Buscar Contas e Cartoes"
    },
    {
      "parameters": {
        "operation": "deleteTable",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "n8n_fila_mensagens",
          "mode": "list"
        },
        "deleteCommand": "delete",
        "where": {
          "values": [
            {
              "column": "telefone",
              "value": "={{ $json.telefone }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        3424,
        720
      ],
      "id": "fd5b9147-8bdf-4e07-9030-2eb728a74891",
      "name": "Limpar fila de mensagens Joaoai - inteligencia",
      "credentials": {
        "postgres": {
          "id": "yZ0x55N1R2A3pz0r",
          "name": "Postgres João.ai"
        }
      }
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT \n    message->>'type' as role,\n    message->>'content' as message,\n    created_at\nFROM n8n_historico_mensagens\nWHERE session_id = $1\n  AND created_at >= (CURRENT_DATE - INTERVAL '1 day')\nORDER BY created_at DESC\nLIMIT 5",
        "options": {
          "queryReplacement": "={{ $('Info').first().json.telefone }}"
        }
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        -240,
        688
      ],
      "id": "1bbc066e-3058-48cc-be5e-c9ed2e5a7aa1",
      "name": "Buscar Histórico Recente",
      "alwaysOutputData": true,
      "credentials": {
        "postgres": {
          "id": "yZ0x55N1R2A3pz0r",
          "name": "Postgres João.ai"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "// ============================================================\n// NODE: Preparar Prompt de Classificação de Intenção\n// ============================================================\n\nconst mensagemAtual = $('Set mensagens1').first().json.mensagem \n  || $('Set mensagens1').first().json.mensagem_audio \n  || '';\n\nconst nomeUsuario = $('Set mensagens1').first().json['Name do usuario'] || '';\n\nlet historico = [];\ntry {\n  historico = $('Buscar Histórico Recente').all().map(item => ({\n    role: item.json.role || item.json.type || 'unknown',\n    message: item.json.message || item.json.content || item.json.text || '',\n  }));\n  historico.reverse();\n} catch (e) {\n  historico = [];\n}\n\nlet historicoFormatado = historico.length > 0\n  ? historico\n      .map(h => {\n        const papel = (h.role === 'human' || h.role === 'user') ? 'USUÁRIO' : 'JOÃO';\n        const msg = h.message.length > 300 ? h.message.substring(0, 300) + '...' : h.message;\n        return `[${papel}]: ${msg}`;\n      })\n      .join('\\n')\n  : '(sem histórico — primeira mensagem do usuário)';\n\n// Limitar tamanho total do histórico para evitar estouro de tokens\nif (historicoFormatado.length > 2000) {\n  historicoFormatado = historicoFormatado.substring(0, 2000) + '\\n... (histórico truncado)';\n}\n\n// Limpar emojis e caracteres especiais que quebram a API\nhistoricoFormatado = historicoFormatado\n  .replace(/[\\u{1F600}-\\u{1F64F}]/gu, '')\n  .replace(/[\\u{1F300}-\\u{1F5FF}]/gu, '')\n  .replace(/[\\u{1F680}-\\u{1F6FF}]/gu, '')\n  .replace(/[\\u{1F1E0}-\\u{1F1FF}]/gu, '')\n  .replace(/[\\u{2600}-\\u{27BF}]/gu, '')\n  .replace(/[\\u{2300}-\\u{23FF}]/gu, '')\n  .replace(/[\\u{2702}-\\u{27B0}]/gu, '')\n  .replace(/[\\u{FE00}-\\u{FE0F}]/gu, '')\n  .replace(/[\\u{1F900}-\\u{1F9FF}]/gu, '')\n  .replace(/[\\u{200D}]/gu, '')\n  .replace(/[\\u{20E3}]/gu, '')\n  .replace(/[\\u{E0020}-\\u{E007F}]/gu, '')\n  .replace(/\\s{2,}/g, ' ');\n\nconst promptClassificacao = `Você é o roteador de intenções do João.ai, um assistente financeiro via WhatsApp.\n\nSua ÚNICA tarefa: classificar a intenção da mensagem do usuário.\n\n═══════════════════════════════════════════════\nINTENÇÕES POSSÍVEIS\n═══════════════════════════════════════════════\n\nCRIAR → O usuário quer registrar uma NOVA transação financeira.\n  Exemplos diretos: \"gastei 50 no mercado\", \"recebi 3000\", \"120 uber\", \"paguei a conta de luz\"\n  Exemplos sutis: \"mercado 89\", \"netflix\", \"almoco 35\"\n  \nEDITAR → O usuário quer MODIFICAR uma transação existente.\n  Exemplos diretos: \"edita o #1034\", \"muda o valor do #200 pra 60\"\n  CONTINUAÇÃO: se o João PERGUNTOU \"o que quer mudar?\" e o usuário responde \n  com o novo valor/dado, isso é EDITAR (não criar).\n  Exemplos de continuação: \"muda pra 60\", \"na verdade foi 45\", \"troca pra alimentação\"\n\nEXCLUIR → O usuário quer REMOVER uma transação.\n  Exemplos diretos: \"exclui o #1005\", \"apaga o último\"\n  CONFIRMAÇÃO: se o João PEDIU \"responda excluir #1005 para confirmar\" \n  e o usuário confirma, isso é EXCLUIR.\n  Exemplos de confirmação: \"excluir #1005\", \"sim pode excluir\", \"confirmo\"\n\nCONSULTAR → O usuário quer VER informações financeiras.\n  Exemplos: \"quanto gastei esse mês\", \"meu saldo\", \"resumo\", \"mostra o #1034\",\n  \"quais minhas categorias\", \"quanto recebi\"\n\nCONVERSA → Qualquer coisa que NÃO é operação financeira.\n  Exemplos: \"oi\", \"obrigado\", \"como funciona\", \"valeu\", \"ajuda\", \"kkk\"\n\n═══════════════════════════════════════════════\nREGRA CRÍTICA: ANÁLISE DE CONTINUIDADE\n═══════════════════════════════════════════════\n\nAntes de classificar, analise o HISTÓRICO:\n\n1. O João fez uma PERGUNTA na última mensagem?\n   Se sim, a resposta do usuário provavelmente é CONTINUAÇÃO do fluxo.\n\n2. Exemplos de continuação que NÃO são transação nova:\n\n   Histórico: João perguntou \"O que quer mudar no #1034?\"\n   Mensagem: \"muda o valor pra 60\"\n   EDITAR (continuação), NÃO criar\n\n   Histórico: João perguntou \"Tem certeza? Responda excluir #1005\"\n   Mensagem: \"excluir #1005\" ou \"sim\"\n   EXCLUIR (confirmação), NÃO criar\n\n   Histórico: João perguntou \"Parece ser Lazer, certo? Ou seria Moradia/Educação?\"\n   Mensagem: \"lazer\" ou \"pode ser\" ou \"isso mesmo\"\n   CRIAR (confirmação de categoria), NÃO conversa\n\n   Histórico: João perguntou \"Qual categoria?\"\n   Mensagem: \"alimentação\"\n   CRIAR (respondendo sobre categoria)\n\n3. Respostas curtas como \"sim\", \"não\", \"pode ser\", \"60\", \"alimentação\":\n   SEMPRE olhe o histórico para determinar o contexto\n   Nunca classifique respostas curtas como CRIAR sem evidência forte\n\n═══════════════════════════════════════════════\nREGRA DE DESEMPATE\n═══════════════════════════════════════════════\n\nSe a mensagem é ambígua:\n- TEM histórico de edição/exclusão em andamento? Use o contexto do histórico\n- TEM valor numérico + estabelecimento/produto? CRIAR\n- TEM # seguido de número? CONSULTAR/EDITAR/EXCLUIR (depende do verbo)\n- Não tem nada claro? CONVERSA\n\n═══════════════════════════════════════════════\nEXEMPLOS COMPLETOS COM HISTÓRICO\n═══════════════════════════════════════════════\n\nEx 1:\n  Hist: [JOAO]: Achei o #1034: R$50 Farmácia. O que quer mudar?\n  Msg: \"muda pra 60\"\n  {\"intencao\": \"editar\", \"razao\": \"Continuação de edição do #1034\"}\n\nEx 2:\n  Hist: [JOAO]: Achei #1005 R$30. Tem certeza? Responda: excluir #1005\n  Msg: \"excluir #1005\"\n  {\"intencao\": \"excluir\", \"razao\": \"Confirmação de exclusão\"}\n\nEx 3:\n  Hist: [JOAO]: Vou anotar R$89! Parece ser Lazer, certo?\n  Msg: \"lazer mesmo\"\n  {\"intencao\": \"criar\", \"razao\": \"Confirmação de categoria\"}\n\nEx 4:\n  Hist: (vazio)\n  Msg: \"gastei 50 no mercado\"\n  {\"intencao\": \"criar\", \"razao\": \"Nova transação\"}\n\nEx 5:\n  Hist: [JOAO]: Anotado! R$120 Restaurante #1050\n  Msg: \"na verdade foi 130\"\n  {\"intencao\": \"editar\", \"razao\": \"Correção do valor recém criado\"}\n\nEx 6:\n  Hist: [JOAO]: O que quer mudar no #1034?\n  Msg: \"50 mercado\"\n  {\"intencao\": \"editar\", \"razao\": \"Resposta de edição, contexto é edição\"}\n\nEx 7:\n  Msg: \"quanto gastei esse mês\"\n  {\"intencao\": \"consultar\", \"razao\": \"Pergunta sobre gastos\"}\n\nEx 8:\n  Msg: \"obrigado\"\n  {\"intencao\": \"conversa\", \"razao\": \"Agradecimento\"}\n\nEx 9:\n  Hist: [JOAO]: Prontinho! R$50 Mercado #1051\n  Msg: \"e também gastei 30 na farmácia\"\n  {\"intencao\": \"criar\", \"razao\": \"Nova transação separada\"}\n\nEx 10:\n  Hist: [JOAO]: O que quer mudar no #1034?\n  Msg: \"deixa pra lá, gastei 40 no uber\"\n  {\"intencao\": \"criar\", \"razao\": \"Abandonou edição, nova transação\"}\n\n═══════════════════════════════════════════════\n\nHISTÓRICO RECENTE DA CONVERSA:\n${historicoFormatado}\n\nMENSAGEM ATUAL DO USUÁRIO:\n${mensagemAtual}\n\nResponda APENAS com JSON puro (sem markdown, sem crases, sem texto extra):\n{\"intencao\": \"criar|editar|excluir|consultar|conversa\", \"razao\": \"explicação curta\"}`;\n\nreturn {\n  json: {\n    prompt_classificacao: promptClassificacao,\n    mensagem_original: mensagemAtual,\n    historico_formatado: historicoFormatado,\n    tem_historico: historico.length > 0,\n    ...$('Set mensagens1').first().json\n  }\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        -32,
        688
      ],
      "id": "94d7fa4f-c056-4e80-9b63-521302e08a4e",
      "name": "Preparar Prompt Classificação"
    },
    {
      "parameters": {
        "modelId": {
          "__rl": true,
          "value": "gpt-4.1-mini",
          "mode": "list",
          "cachedResultName": "GPT-4.1-MINI"
        },
        "responses": {
          "values": [
            {
              "content": "=={{ $json.prompt_classificacao }}"
            }
          ]
        },
        "builtInTools": {},
        "options": {
          "maxTokens": 100,
          "temperature": 0
        }
      },
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 2.1,
      "position": [
        128,
        688
      ],
      "id": "e8f66d76-e06c-4dc3-8c40-3d452274aa02",
      "name": "OpenAI - Classificar Intenção",
      "credentials": {
        "openAiApi": {
          "id": "vKBno59QWhuUp1sz",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const resposta = $input.first().json;\n\nlet texto = '';\n\n// Estrutura: output[].content[].text (formato novo OpenAI)\nif (Array.isArray(resposta.output)) {\n  for (const block of resposta.output) {\n    if (block.content && Array.isArray(block.content)) {\n      for (const c of block.content) {\n        if (c.text) { texto = c.text; break; }\n      }\n    }\n    if (texto) break;\n  }\n}\n\n// Fallbacks\nif (!texto && typeof resposta.output === 'string') texto = resposta.output;\nif (!texto && resposta.message?.content) texto = resposta.message.content;\nif (!texto && resposta.text) texto = resposta.text;\n\nlet resultado;\ntry {\n  const limpo = texto.replace(/```json\\n?/g, '').replace(/```\\n?/g, '').replace(/^\\s*\\n/gm, '').trim();\n  resultado = JSON.parse(limpo);\n} catch (e) {\n  const match = texto.match(/\\{[^}]+\\}/);\n  if (match) {\n    try { resultado = JSON.parse(match[0]); } catch (e2) { resultado = { intencao: 'conversa', razao: 'Falha no parse' }; }\n  } else {\n    resultado = { intencao: 'conversa', razao: 'Falha no parse' };\n  }\n}\n\nconst validas = ['criar', 'editar', 'excluir', 'consultar', 'conversa'];\nif (!validas.includes(resultado.intencao)) { resultado.intencao = 'conversa'; }\n\nconst dadosOriginais = $('Preparar Prompt Classificação').first().json;\nconst { prompt_classificacao, historico_formatado, ...dadosLimpos } = dadosOriginais;\n\nreturn {\n  json: {\n    ...dadosLimpos,\n    intencao: resultado.intencao,\n    razao_classificacao: resultado.razao || ''\n  }\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        448,
        688
      ],
      "id": "f1b158dc-85ac-457c-8cca-9514ed7c4dea",
      "name": "Processar Resultado"
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "intencao-criar",
                    "leftValue": "={{ $json.intencao }}",
                    "rightValue": "criar",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Criar"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "intencao-resto",
                    "leftValue": "={{ $json.intencao }}",
                    "rightValue": "criar",
                    "operator": {
                      "type": "string",
                      "operation": "notEquals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Direto ao Agente"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3.2,
      "position": [
        672,
        688
      ],
      "id": "81fa5ffd-bb43-4a02-a1a9-a8663af4fb9f",
      "name": "Roteamento por Intenção"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "7eab8669-6929-4dc6-b3e2-943065bc306c",
              "name": "mensagem",
              "value": "={{ $('Info').first().json.mensagem ? $('Mensagem encavalada?').all().map(info => info.json.mensagem).join('\\\\n') : ($('Analyze an image').isExecuted ? ($('Analyze an image').first().json?.content?.parts?.[0]?.text || '') : '') }}",
              "type": "string"
            },
            {
              "id": "676d14ec-72d3-4970-9fa0-5e39ff976011",
              "name": "mensagem_audio",
              "value": "={{ $('Info').first().json.mensagem_de_audio ? ($('Transcrever audio').isExecuted ? $('Transcrever audio').first().json.text : '') : '' }}",
              "type": "string"
            },
            {
              "id": "9b781cc7-d43e-4116-b537-c8634387ab32",
              "name": "Imagem",
              "value": "={{ $('Info').first().json.PDF }}",
              "type": "string"
            },
            {
              "id": "f2fdd072-0e37-4c52-9c6f-ca4ae69c612c",
              "name": "org_id",
              "value": "={{ $('Buscar Org ID').first().json.org_id || null }}",
              "type": "string"
            },
            {
              "id": "d4cece13-52e6-485f-b0dc-f0be32be02f8",
              "name": "org_name",
              "value": "={{ $('Buscar Org ID').first().json.org_name || 'Visitante' }}",
              "type": "string"
            },
            {
              "id": "2af85bc0-d9b0-4756-ac21-e34b9684f48a",
              "name": "status",
              "value": "={{ $('Buscar Org ID').first().json.status || 'new_lead' }}",
              "type": "string"
            },
            {
              "id": "681e121e-50ac-4035-aa0b-e75cd194fc77",
              "name": "Name do usuario",
              "value": "={{ $('Buscar Org ID').first().json.org_name.split(' ')[0] }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        -1072,
        1360
      ],
      "id": "b5045066-62fb-46d1-97a8-c9cbdd6ac5f9",
      "name": "Set mensagens1",
      "executeOnce": true
    },
    {
      "parameters": {
        "content": "# 💰 Agente de Cobrança\nSwitch Saída 1: expired / suspended / inactive\nGPT-4o-mini • Sem ferramentas financeiras",
        "height": 680,
        "width": 1800,
        "color": 7
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        -336,
        1168
      ],
      "id": "7c6f4a8a-2f02-4594-8dcd-cc9af1010a52",
      "name": "Sticky Note - Cobrança"
    },
    {
      "parameters": {
        "agent": "conversationalAgent",
        "promptType": "define",
        "text": "=={{ (() => {\n  const nome = $json['Name do usuario'] || $json.org_name?.split(' ')[0] || '';\n  const msg = $json.mensagem || $json.mensagem_audio || '';\n  const status = $json.status || 'expired';\n  return `Status: ${status}\\nNome: ${nome}\\nMensagem: ${msg}`;\n})() }}",
        "options": {
          "systemMessage": "Você é o João, assistente financeiro pessoal da João.ai. Você atende exclusivamente pelo WhatsApp.\n\n[CONTEXTO DO USUÁRIO]\nO usuário atual teve seu plano encerrado (trial venceu ou assinatura expirou). O acesso dele a novos registros está bloqueado, mas os dados financeiros anteriores estão 100% guardados e seguros. Seu objetivo é converter esse usuário para um plano pago de forma consultiva, leve e amigável. O nome do usuário será fornecido a você na entrada da mensagem.\n\n---\n\n### 1. PERSONA E TOM DE VOZ\n- Aja como um amigo experiente em finanças: leve, próximo, acolhedor e genuinamente interessado no sucesso do usuário.\n- NUNCA soe como um robô corporativo ou atendente de telemarketing. A venda deve ser natural.\n- Trate o usuário pelo NOME em todas as respostas (geralmente na primeira frase). NUNCA esqueça o nome.\n- Use frases curtas, diretas e com ritmo de conversa de WhatsApp.\n- Seja criativo e varie as palavras, não repita sempre os mesmos padrões de saudação.\n\n### 2. REGRAS DE FORMATAÇÃO (CRÍTICAS)\n- SEPARADOR DE MENSAGENS: Esta é a regra mais importante. Você DEVE usar ||| para separar cada mensagem. Sem exceção. Se sua resposta não contém |||, ela está ERRADA. Cada bloco entre ||| representa um balão de mensagem diferente no WhatsApp.\n- LIMITES: Use no MÍNIMO 2 e no MÁXIMO 4 blocos (mensagens) por resposta.\n- NUNCA envie tudo em um único bloco de texto. Uma resposta sem ||| é uma resposta incorreta.\n- NEGRITO: Use *asteriscos* para destacar palavras-chave importantes (ex: *Mensal*, *Anual*, *economia*). Não se esqueça de usar formatação negrito, da vida e enfase a mensagem\n- EMOJIS: Use com naturalidade (2 a 8 no total da resposta). \n- ESPAÇAMENTO: Quando listar os planos, SEMPRE deixe uma linha em branco entre o plano mensal e o plano anual.\n\n### 3. PLANOS E LINKS\n- Mensal: R$ 29,90/mês (menos de R$ 1/dia) | Link: https://www.asaas.com/c/tiafqne6ykx6bl46\n- Anual: R$ 149,90/ano (sai R$ 12,50/mês — R$ 0,41/dia!) - Economia de 58% | Link: https://www.asaas.com/c/py0taq64d45zlktu\n- Formas de pagamento: PIX (libera na hora), cartão ou boleto.\n\n---\n\n### 4. GUIA DE CENÁRIOS E EXEMPLOS\n\nCENÁRIO A: Saudação simples (ex: \"oi\", \"olá\", \"e aí\")\nSempre 3 mensagens. Saudação com nome + explica situação -> Apresenta planos -> Links.\nExemplo:\nEai, [Nome]! Que bom te ver por aqui 💚|||Seu período de teste terminou, mas *tá tudo guardadinho!* Bora reativar? Temos duas opções:\n\n*Mensal* — R$ 29,90/mês (menos de R$ 1 por dia) ☕\n\n*Anual* — R$ 149,90/ano (sai R$ 0,41/dia!). Economia de 58% 🔥|||Vou deixar os links aqui, é só escolher e pagar (PIX libera na hora):\n\n💳 *Mensal* → https://www.asaas.com/c/tiafqne6ykx6bl46\n\n💎 *Anual* → https://www.asaas.com/c/py0taq64d45zlktu\n\nCENÁRIO B: Envio de lançamento financeiro (ex: \"gastei 50 no mercado\")\nSempre 3 mensagens. Reconheça o gasto + nome -> Apresente opções -> Envie links.\nExemplo:\n*Anotado mentalmente,* [Nome]! rs 🙈 Brinquei porque seu plano expirou e não consigo registrar isso oficialmente agora 💚|||Bora reativar pra você não perder o controle? Temos duas opções:\n\n*Mensal* — R$ 29,90/mês (menos de R$ 1 por dia) ☕\n\n*Anual* — R$ 149,90/ano (sai R$ 0,41/dia... menos que uma bala!). Economia de 58% 🔥|||Vou deixar os links aqui, é só escolher e pagar (PIX libera na hora):\n\nMensal → https://www.asaas.com/c/tiafqne6ykx6bl46 💳\n\nAnual → https://www.asaas.com/c/py0taq64d45zlktu 💎\n\nCENÁRIO C: Perguntou sobre preço direto\nSempre 3 mensagens. Contexto + Nome -> Comparação Anual/Mensal com linha em branco -> Links de pagamento no terceiro bloco.\n\nCENÁRIO D: Disse que vai pensar\nSempre 2 mensagens. Encoraje com leveza, reforce a segurança dos dados e o valor.\nExemplo:\nSem pressa, [Nome]! Fica tranquilo que tudo o que você já anotou tá *100% seguro* com a gente 🔒|||Mas não demora pra voltar, hein? O controle financeiro muda o jogo. Lembra que o plano anual custa só *R$ 0,41 por dia*... menos que um chiclete! Qualquer dúvida, tô por aqui 💚\n\nCENÁRIO E: Reclamou do preço / Achou caro\nSempre 2 mensagens. Relativize o custo -> Envie os links.\nExemplo:\nEntendo super, [Nome]! Mas pensa pelo lado do investimento: no mensal dá menos de *R$ 1 por dia*... mais barato que o cafezinho da padaria! Imagina o tempo e a dor de cabeça que você economiza não fazendo planilha na mão ☕😄|||Se quiser aproveitar o desconto de 58%, vai de anual:\n\nAnual → https://www.asaas.com/c/py0taq64d45zlktu 💎\n\nOu começa no mensal:\n\nMensal → https://www.asaas.com/c/tiafqne6ykx6bl46 💳\n\nCENÁRIO F: Pediu pra falar com humano ou suporte\n1 a 2 mensagens.\nExemplo:\n💚 Claro, [Nome]! O nosso time de suporte é super ágil. Manda um email pra contato@joao.ai que o pessoal te ajuda rapidinho 📩\n\nCENÁRIO G: Perguntou o que o João.ai faz\n2 mensagens. Explique as funcionalidades + ofereça os links.\nExemplo:\nO João.ai é seu assistente financeiro no WhatsApp, [Nome] 💚! Você manda um áudio, foto, texto ou PDF e eu registro o gasto automaticamente. Tudo categorizado por IA, com painel web cheio de gráficos, planejamento de orçamento e controle de contas e cartões 🚀|||Quer experimentar de verdade? É só ativar um plano:\n\n*Mensal* — R$ 29,90/mês ☕\n\n*Anual* — R$ 149,90/ano (economia de 58%!) 🔥\n\nMensal → https://www.asaas.com/c/tiafqne6ykx6bl46 💳\n\nAnual → https://www.asaas.com/c/py0taq64d45zlktu 💎\n\n---\n\n### 5. REGRAS ABSOLUTAS (O QUE NUNCA FAZER)\n- NÃO registre transações financeiras sob nenhuma hipótese (o acesso está pausado).\n- NÃO acesse dados financeiros reais do usuário.\n- NUNCA esqueça do separador |||. Resposta sem ||| é resposta ERRADA.\n- NUNCA use termos de urgência falsos (ex: dizer que os dados serão apagados).\n- NUNCA termine a conversa sem um próximo passo claro para o usuário assinar.\n- NUNCA use expressões informais demais ou desrespeitosas como \"toma aqui\", \"toma aí\", \"pega aí\".\n- NUNCA esqueça o nome do usuário."
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.9,
      "position": [
        -208,
        1360
      ],
      "id": "b5e033d7-3ad2-4489-8741-b0208a81c0cc",
      "name": "João - Cobrança"
    },
    {
      "parameters": {
        "model": {
          "__rl": true,
          "value": "gpt-4o-mini",
          "mode": "list",
          "cachedResultName": "gpt-4o-mini"
        },
        "builtInTools": {},
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.3,
      "position": [
        -208,
        1568
      ],
      "id": "3e941c47-ef08-4a4f-88c5-19ef8a1bdaa7",
      "name": "GPT - Cobrança",
      "credentials": {
        "openAiApi": {
          "id": "vKBno59QWhuUp1sz",
          "name": "OpenAi account"
        }
      }
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "={{ $('Info').first().json.telefone }}_cobranca",
        "tableName": "n8n_historico_mensagens",
        "contextWindowLength": 10
      },
      "type": "@n8n/n8n-nodes-langchain.memoryPostgresChat",
      "typeVersion": 1.3,
      "position": [
        -80,
        1568
      ],
      "id": "e472c802-82b4-421d-b889-7abda64957b6",
      "name": "Memory - Cobrança",
      "credentials": {
        "postgres": {
          "id": "yZ0x55N1R2A3pz0r",
          "name": "Postgres João.ai"
        }
      }
    },
    {
      "parameters": {
        "description": "Use a ferramenta para refletir sobre algo. Ela não obterá novas informações nem alterará o banco de dados, apenas adicionará o pensamento ao registro."
      },
      "type": "@n8n/n8n-nodes-langchain.toolThink",
      "typeVersion": 1,
      "position": [
        128,
        1568
      ],
      "id": "1e8a8717-2668-4f55-8ea3-6c4b43b1ebf3",
      "name": "Refletir Cobrança"
    },
    {
      "parameters": {
        "jsCode": "const textoCompleto = $input.item.json.output || '';\nconst pedacos = textoCompleto.split('|||');\nreturn pedacos\n  .map(pedaco => pedaco.trim())\n  .filter(pedaco => pedaco.length > 0)\n  .map(pedaco => ({ json: { output: pedaco } }));"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        208,
        1360
      ],
      "id": "284287c8-2d47-4403-9beb-3f62e9596fc6",
      "name": "Quebrar Mensagens (Cobrança)"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [
        464,
        1360
      ],
      "id": "1a147722-4b11-4735-bee4-cf8d884e77a1",
      "name": "Loop Cobrança"
    },
    {
      "parameters": {
        "amount": 1.75
      },
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        736,
        1360
      ],
      "id": "601f0a20-ec83-4350-90cc-b22b367c369d",
      "name": "Delay Cobrança",
      "webhookId": "cobranca-delay-001"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Info').item.json.url_chatwoot }}/api/v1/accounts/{{ $('Info').item.json.id_conta }}/conversations/{{ $('Info').item.json.id_conversa }}/messages",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "content",
              "value": "={{ $json.output }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        992,
        1360
      ],
      "id": "4ecfc012-e26f-42c2-a4ce-b900fbb90158",
      "name": "Responder (Cobrança)",
      "credentials": {
        "httpHeaderAuth": {
          "id": "Uu2idpJ4OzVCCTJG",
          "name": "ChatWoot_Joaoai"
        }
      }
    },
    {
      "parameters": {
        "url": "=https://hktcosudbmvqjmallyyl.supabase.co/rest/v1/transactions?org_id=eq.{{ $('Set mensagens1').first().json.org_id }}&created_at=gte.{{ $now.minus({minutes: 2}).toUTC().toISO() }}&select=id&limit=1",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucmFoZWVyZ3d3aXZkYWR5bmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE1NTI2MywiZXhwIjoyMDgzNzMxMjYzfQ.mWWVj9B5j8wPhh9G_UlulFT6U2KR1_xqnYpp4WVWg5E"
            },
            {
              "name": "Authorization",
              "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucmFoZWVyZ3d3aXZkYWR5bmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE1NTI2MywiZXhwIjoyMDgzNzMxMjYzfQ.mWWVj9B5j8wPhh9G_UlulFT6U2KR1_xqnYpp4WVWg5E"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        4240,
        912
      ],
      "id": "0f50dd5b-70bf-421a-9d3d-fa84627e2bb7",
      "name": "Checar Transação Recente",
      "alwaysOutputData": false
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://hktcosudbmvqjmallyyl.supabase.co/rest/v1/rpc/update_achievements_after_transaction",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucmFoZWVyZ3d3aXZkYWR5bmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE1NTI2MywiZXhwIjoyMDgzNzMxMjYzfQ.mWWVj9B5j8wPhh9G_UlulFT6U2KR1_xqnYpp4WVWg5E"
            },
            {
              "name": "Authorization",
              "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucmFoZWVyZ3d3aXZkYWR5bmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE1NTI2MywiZXhwIjoyMDgzNzMxMjYzfQ.mWWVj9B5j8wPhh9G_UlulFT6U2KR1_xqnYpp4WVWg5E"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ JSON.stringify({ p_org_id: $('Set mensagens1').first().json.org_id }) }}",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        4496,
        912
      ],
      "id": "14c89df2-7992-4430-9ad8-3ed177d8c0d0",
      "name": "RPC Conquistas"
    },
    {
      "parameters": {
        "jsCode": "// === MONTAR MENSAGENS DE CONQUISTA ===\n// Este node NÃO faz HTTP — só monta texto a partir da RPC\n\nconst conquistas = $json;\nlet nome = '';\ntry { nome = $('Set mensagens1').first().json['Name do usuario'] || ''; } catch(e) {}\n\nconst mensagens = [];\nconst streak = conquistas.streak || 0;\nconst newlyUnlocked = conquistas.newly_unlocked || [];\nconst nextBadges = conquistas.next_badges || [];\nconst txCount = conquistas.transactions_count || 0;\n\n// === BADGE DESBLOQUEADO ===\nif (newlyUnlocked.length > 0) {\n  for (const badge of newlyUnlocked) {\n    mensagens.push(\n      `🏆 *CONQUISTA DESBLOQUEADA!*\\n\\n${badge.emoji} *${badge.name}*\\n_${badge.description}_\\n\\nParabéns, ${nome}! 🎉`\n    );\n  }\n\n  // Próximo badge\n  if (nextBadges.length > 0) {\n    const next = nextBadges[0];\n    mensagens.push(\n      `Próximo badge:\\n${next.emoji} *${next.name}* — *${next.pct}%* (${next.current_value}/${next.threshold})\\n\\nVeja todas em joaoai.vercel.app 🏆`\n    );\n  }\n}\n\n// === A CADA 5 REGISTROS (sem badge novo) ===\nif (newlyUnlocked.length === 0 && txCount > 0 && txCount % 5 === 0) {\n  if (nextBadges.length > 0) {\n    let msg = `🔥 Streak: *${streak} dias*\\n\\n🎯 Conquistas próximas:\\n\\n`;\n    for (const b of nextBadges) {\n      msg += `${b.emoji} ${b.name} — *${b.pct}%* (${b.current_value}/${b.threshold})\\n`;\n    }\n    mensagens.push(msg.trim());\n  }\n}\n\n// === RETORNAR ===\nif (mensagens.length === 0) {\n  return [];\n}\n\nreturn mensagens.map(m => ({ json: { output: m } }));"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        4736,
        912
      ],
      "id": "d4759bc7-92d4-4831-bbf3-acefe0979a79",
      "name": "Montar Mensagens Conquista"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [
        5152,
        912
      ],
      "id": "a7d15c1f-c5df-4c04-b852-0d362109b072",
      "name": "Loop Conquistas"
    },
    {
      "parameters": {
        "amount": 1.5
      },
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        5408,
        928
      ],
      "id": "243fd20f-164c-4738-a84b-d7afe71f3814",
      "name": "Delay Conquistas",
      "webhookId": "gc-delay-webhook-001"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Info').first().json.url_chatwoot }}/api/v1/accounts/{{ $('Info').first().json.id_conta }}/conversations/{{ $('Info').first().json.id_conversa }}/messages",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "content",
              "value": "={{ $json.output }}"
            },
            {
              "name": "message_type",
              "value": "outgoing"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        5648,
        928
      ],
      "id": "9d7588e6-ca13-4aa7-af9b-3e478b96537d",
      "name": "Enviar Conquista WhatsApp",
      "credentials": {
        "httpHeaderAuth": {
          "id": "Uu2idpJ4OzVCCTJG",
          "name": "ChatWoot_Joaoai"
        }
      }
    },
    {
      "parameters": {
        "content": "## 🏆 GAMIFICAÇÃO\n\nApós limpar fila:\n1. Checar se teve transação nos últimos 2min\n2. Se sim → RPC atualiza streak + badges + retorna novos desbloqueios\n3. Monta mensagens (só texto, sem HTTP)\n4. Envia pelo Chatwoot como mensagem separada",
        "height": 476,
        "width": 1948,
        "color": 5
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        4176,
        624
      ],
      "id": "23b24513-5ff7-4ec2-b821-931db8af924d",
      "name": "Sticky Note - Conquistas"
    },
    {
      "parameters": {
        "amount": 30
      },
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        4944,
        912
      ],
      "id": "49d574fb-6618-4a65-803a-a2d0a7818ac3",
      "name": "Esperar1",
      "webhookId": "88a86305-9f6b-4328-9ff3-9644d3e36b70"
    },
    {
      "parameters": {
        "descriptionType": "manual",
        "toolDescription": "Cria um novo registro financeiro no João.ai.\n\nCAMPOS OBRIGATÓRIOS:\n- p_val: Valor numérico (ex: 97.00)\n- p_obs: Descrição da compra (ex: 'Biscoito')\n- p_tipo: EXPENSE ou INCOME\n- p_status: PAID ou PENDING\n\nCAMPOS OPCIONAIS (use os IDs do contexto_financeiro):\n- p_cat_id: UUID da CATEGORIA PRINCIPAL (ex: '58beac04-4796-4374-9872-4ef8ee5360c5')\n- p_sub_cat_id: UUID da SUBCATEGORIA (opcional). Só envie quando o contexto trouxer SUBCATEGORY_ID. Caso contrário, omita.\n- p_acc_id: UUID da conta bancária\n- p_card_id: UUID do cartão de crédito\n- p_data: Data no formato YYYY-MM-DD (deixe vazio para hoje)\n\nIMPORTANTE: Se categoria/subcategoria/conta/cartão não forem especificados, deixe VAZIO (não envie 'true').",
        "tableId": "transactions",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "org_id",
              "fieldValue": "={{ $('Set mensagens1').first().json.org_id }}"
            },
            {
              "fieldId": "description",
              "fieldValue": "={{ $fromAI('fieldValues1_Field_Value', `Observação ou o que foi comprado/recebido`, 'string') }}"
            },
            {
              "fieldId": "amount",
              "fieldValue": "={{ $fromAI(\"p_val\", \"Valor numérico (ex: 50.00)\", \"number\") }}"
            },
            {
              "fieldId": "type",
              "fieldValue": "={{ $fromAI(\"p_tipo\", \"EXPENSE (gasto) ou INCOME (receita)\", \"string\") }}"
            },
            {
              "fieldId": "status",
              "fieldValue": "={{ $fromAI(\"p_status\", \"PAID (pago) ou PENDING (não pago)\", \"string\") }}"
            },
            {
              "fieldId": "date",
              "fieldValue": "={{ $fromAI('p_data', 'Data YYYY-MM-DD', 'string') || $now.format('yyyy-MM-dd') }}"
            },
            {
              "fieldId": "category_id",
              "fieldValue": "={{ $fromAI('p_cat_id', 'UUID da categoria PRINCIPAL (parent_id null) da lista de categorias', 'string') || null }}"
            },
            {
              "fieldId": "subcategory_id",
              "fieldValue": "={{ $fromAI('p_sub_cat_id', 'UUID da SUBCATEGORIA (filha da categoria escolhida). Opcional - omita se nenhuma subcategoria precisa', 'string') || null }}"
            },
            {
              "fieldId": "account_id",
              "fieldValue": "={{ null }}"
            },
            {
              "fieldId": "credit_card_id",
              "fieldValue": "={{ null }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabaseTool",
      "typeVersion": 1,
      "position": [
        1728,
        928
      ],
      "id": "763dea8a-e953-4507-b11d-4dba46416294",
      "name": "Lancar1",
      "credentials": {
        "supabaseApi": {
          "id": "7CklUdEsm81GLmfi",
          "name": "Supabase Joaoai"
        }
      }
    }
  ],
  "connections": {
    "Mensagem chegando?": {
      "main": [
        [
          {
            "node": "Tipo de mensagem",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Mensagem recebida": {
      "main": [
        [
          {
            "node": "Info",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Mensagem encavalada?": {
      "main": [
        [
          {
            "node": "Limpar fila de mensagens",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Buscar mensagens": {
      "main": [
        [
          {
            "node": "Mensagem encavalada?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Limpar fila de mensagens": {
      "main": [
        [
          {
            "node": "Marcar como lidas",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Esperar": {
      "main": [
        [
          {
            "node": "Buscar mensagens",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Tipo de mensagem": {
      "main": [
        [
          {
            "node": "Enfileirar mensagem.",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Download áudio",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Download Documento",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Download Documento",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Download Documento",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Enfileirar mensagem.": {
      "main": [
        [
          {
            "node": "Esperar",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Marcar como lidas": {
      "main": [
        [
          {
            "node": "Digitando/Gravando...",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Download áudio": {
      "main": [
        [
          {
            "node": "Extract from File",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Transcrever audio": {
      "main": [
        [
          {
            "node": "Marcar como lidas",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract from File": {
      "main": [
        [
          {
            "node": "Convert to File",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Convert to File": {
      "main": [
        [
          {
            "node": "Transcrever audio",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Info": {
      "main": [
        [
          {
            "node": "Mensagem chegando?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Merge": {
      "main": [
        [
          {
            "node": "Analyze an image",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Download Documento": {
      "main": [
        [
          {
            "node": "Detectar tipo de arquivo",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Detectar tipo de arquivo": {
      "main": [
        [
          {
            "node": "Merge",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Analyze an image": {
      "main": [
        [
          {
            "node": "Marcar como lidas",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Buscar Org ID": {
      "main": [
        [
          {
            "node": "Set mensagens1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Digitando/Gravando...": {
      "main": [
        [
          {
            "node": "Buscar Org ID",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Memory": {
      "ai_memory": [
        [
          {
            "node": "Joaoai Inteligencia",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "Refletir": {
      "ai_tool": [
        [
          {
            "node": "Joaoai Inteligencia",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "Joaoai Inteligencia",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Reagir Mensagem Whatspp": {
      "ai_tool": [
        [
          {
            "node": "Joaoai Inteligencia",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Reagir Leo": {
      "ai_tool": [
        [
          {
            "node": "João - Vendas",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Filtro Mensagem": {
      "main": [
        [
          {
            "node": "Extrair Dados (JS)1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Preparar Trial": {
      "main": [
        [
          {
            "node": "Filtro Mensagem",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Roteamento por Status": {
      "main": [
        [
          {
            "node": "Buscar Histórico Recente",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "João - Cobrança",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Preparar Trial",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Refletir Léo": {
      "ai_tool": [
        [
          {
            "node": "João - Vendas",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "GPT - Léo": {
      "ai_languageModel": [
        [
          {
            "node": "João - Vendas",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Memory - Léo": {
      "ai_memory": [
        [
          {
            "node": "João - Vendas",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "Responder (Léo)": {
      "main": [
        [
          {
            "node": "Loop Over Items",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Quebrar Mensagens": {
      "main": [
        [
          {
            "node": "Loop Over Items",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Loop Over Items": {
      "main": [
        [],
        [
          {
            "node": "Wait",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Wait": {
      "main": [
        [
          {
            "node": "Responder (Léo)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Loop Resposta": {
      "main": [
        [
          {
            "node": "Limpar fila de mensagens Joaoai - inteligencia",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Delay entre as mensagens",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Responder usuário (Loop)": {
      "main": [
        [
          {
            "node": "Loop Resposta",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Buscar Categorias": {
      "ai_tool": [
        [
          {
            "node": "Joaoai Inteligencia",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Editar_Lancamento": {
      "ai_tool": [
        [
          {
            "node": "Joaoai Inteligencia",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Excluir_Lancamento": {
      "ai_tool": [
        [
          {
            "node": "Joaoai Inteligencia",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Criar Conta Trial1": {
      "ai_tool": [
        [
          {
            "node": "João - Vendas",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Extrair Dados (JS)1": {
      "main": [
        [
          {
            "node": "Apenas Mensagem",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Apenas Mensagem": {
      "main": [
        [
          {
            "node": "João - Vendas",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "João - Vendas": {
      "main": [
        [
          {
            "node": "Quebrar Mensagens",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Categorizacao": {
      "main": [
        [
          {
            "node": "Formatar com categoria",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Bucar categoria": {
      "main": [
        [
          {
            "node": "Consolidar Categorias",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Consolidar Categorias": {
      "main": [
        [
          {
            "node": "Categorizacao",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Formatar com categoria": {
      "main": [
        [
          {
            "node": "Joaoai Inteligencia",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Buscar_Lancamento": {
      "ai_tool": [
        [
          {
            "node": "Joaoai Inteligencia",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Joaoai Inteligencia": {
      "main": [
        [
          {
            "node": "Quebrar Mensagens1",
            "type": "main",
            "index": 0
          },
          {
            "node": "Log de Auditoria IA",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Delay entre as mensagens": {
      "main": [
        [
          {
            "node": "Responder usuário (Loop)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Quebrar Mensagens1": {
      "main": [
        [
          {
            "node": "Loop Resposta",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Buscar Contas e Cartoes": {
      "ai_tool": [
        [
          {
            "node": "Joaoai Inteligencia",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Limpar fila de mensagens Joaoai - inteligencia": {
      "main": [
        [
          {
            "node": "Checar Transação Recente",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Buscar Histórico Recente": {
      "main": [
        [
          {
            "node": "Preparar Prompt Classificação",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Preparar Prompt Classificação": {
      "main": [
        [
          {
            "node": "OpenAI - Classificar Intenção",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI - Classificar Intenção": {
      "main": [
        [
          {
            "node": "Processar Resultado",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Processar Resultado": {
      "main": [
        [
          {
            "node": "Roteamento por Intenção",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Roteamento por Intenção": {
      "main": [
        [
          {
            "node": "Bucar categoria",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Joaoai Inteligencia",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Set mensagens1": {
      "main": [
        [
          {
            "node": "Roteamento por Status",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "João - Cobrança": {
      "main": [
        [
          {
            "node": "Quebrar Mensagens (Cobrança)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "GPT - Cobrança": {
      "ai_languageModel": [
        [
          {
            "node": "João - Cobrança",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Memory - Cobrança": {
      "ai_memory": [
        [
          {
            "node": "João - Cobrança",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "Refletir Cobrança": {
      "ai_tool": [
        [
          {
            "node": "João - Cobrança",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Quebrar Mensagens (Cobrança)": {
      "main": [
        [
          {
            "node": "Loop Cobrança",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Loop Cobrança": {
      "main": [
        [],
        [
          {
            "node": "Delay Cobrança",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Delay Cobrança": {
      "main": [
        [
          {
            "node": "Responder (Cobrança)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Responder (Cobrança)": {
      "main": [
        [
          {
            "node": "Loop Cobrança",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Checar Transação Recente": {
      "main": [
        [
          {
            "node": "RPC Conquistas",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "RPC Conquistas": {
      "main": [
        [
          {
            "node": "Montar Mensagens Conquista",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Montar Mensagens Conquista": {
      "main": [
        [
          {
            "node": "Esperar1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Loop Conquistas": {
      "main": [
        [],
        [
          {
            "node": "Delay Conquistas",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Delay Conquistas": {
      "main": [
        [
          {
            "node": "Enviar Conquista WhatsApp",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Enviar Conquista WhatsApp": {
      "main": [
        [
          {
            "node": "Loop Conquistas",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Esperar1": {
      "main": [
        [
          {
            "node": "Loop Conquistas",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Lancar1": {
      "ai_tool": [
        [
          {
            "node": "Joaoai Inteligencia",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "0d9a9c0abf4197c3a6a0d07da99221ba39f5016890e60b2a11074995231676af"
  }
}