import {Injectable} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {formatMessage} from 'devextreme/localization';

export interface FlowNodeInfo {
    category: string;
    type: string;
    title: string;
    defaultText: string;
    icon: string;
    options: any[];
}

@Injectable()
export class FlowNodeService {

    constructor() {
    }

    public getNodeInfos() {
        return [
            {
                category: 'consumer',
                type: 'directConsumer',
                title: formatMessage('DirectConsumer'),
                defaultText: formatMessage('DirectConsumer'),
                icon: 'assets/icons/flow/diagram/direct_c.png',
                options: []
            },
            // {
            //     category: 'consumer',
            //     type: 'file',
            //     title: formatMessage('FileConsumer'),
            //     defaultText: formatMessage('FileConsumer'),
            //     icon: 'assets/icons/flow/diagram/file_c.png',
            //     options: [
            //         {
            //             name: 'directoryName',
            //             defaultValue: '/home/rocky/files'
            //         },
            //         {
            //             name: 'fileName',
            //             defaultValue: ''
            //         },
            //     ]
            // },
            {
                category: 'consumer',
                type: 'rest',
                title: formatMessage('Rest'),
                defaultText: formatMessage('Rest'),
                icon: 'assets/icons/flow/diagram/rest_c.png',
                options: [
                    {
                        name: 'httpMethod',
                        defaultValue: 'GET'
                    },
                    {
                        name: 'path',
                        defaultValue: 'myapp'
                    },
                    {
                        name: 'headers',
                        defaultValue: [
                            {
                                id: uuidv4(),
                                name: 'Accept',
                                type: 'String',
                                defaultValue: 'application/json'
                            },
                            {
                                id: uuidv4(),
                                name: 'Content-Type',
                                type: 'String',
                                defaultValue: 'application/json'
                            }
                        ]
                    },
                    {
                        name: 'body',
                        defaultValue: ''
                    },
                    {
                        name: 'parameters',
                        defaultValue: []
                    },
                    {
                        name: 'elements',
                        defaultValue: []
                    },
                ]
            },
            /*{
                category: 'consumer',
                type: 'kafka',
                title: formatMessage('KafkaConsumer'),
                defaultText: formatMessage('KafkaConsumer'),
                icon: 'assets/icons/flow/diagram/kafka_c.png',
                options: [
                    {
                        name: 'topic',
                        defaultValue: 'topic-001'
                    },
                    {
                        name: 'brokers',
                        defaultValue: 'localhost:9092'
                    },
                    {
                        name: 'consumersCount',
                        defaultValue: '1'
                    },
                    {
                        name: 'groupId',
                        defaultValue: 'group-001'
                    },
                    {
                        name: 'autoOffsetReset',
                        defaultValue: 'latest'
                    }
                ]
            },*/
            {
                category: 'consumer',
                type: 'scheduler',
                title: formatMessage('Scheduler'),
                defaultText: formatMessage('Scheduler'),
                icon: 'assets/icons/flow/diagram/scheduler_c.png',
                options: [
                    {
                        name: 'period',
                        defaultValue: '1000'
                    }
                ]
            },
            {
                category: 'producer',
                type: 'log',
                title: 'Log',
                defaultText: 'Log',
                icon: 'assets/icons/flow/diagram/log.svg',
                options: [
                    {
                        name: 'log',
                        defaultValue: '${body}'
                    },
                ]
            },
            {
                category: 'logic',
                type: 'function',
                title: formatMessage('Process'),
                defaultText: formatMessage('Process'),
                icon: 'assets/icons/flow/diagram/function_l.png',
                options: [
                    {
                        name: 'language',
                        defaultValue: 'Simple'
                    },
                    {
                        name: 'expression',
                        defaultValue: '${body}'
                    },
                    {
                        name: 'blockly',
                        defaultValue: '<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"body\" id=\"P`vw*ESyG^G%YY9r(BA;\" x=\"100\" y=\"100\"></block></xml>'
                    }
                ]
            },
           /* {
                category: 'logic',
                type: 'behavior',
                title: formatMessage('Behavior'),
                defaultText: formatMessage('Behavior'),
                icon: 'assets/icons/flow/diagram/function_l.png',
                options: [
                ]
            },*/
            {
                category: 'logic',
                type: 'choice',
                title: formatMessage('Choice'),
                defaultText: formatMessage('Choice'),
                icon: 'assets/icons/flow/diagram/choice.png',
                options: []
            },
            // {
            //     category: 'logic',
            //     type: 'choiceEnd',
            //     title: 'Choice End',
            //     defaultText: 'Choice End',
            //     icon: 'assets/icons/flow/diagram/whenEnd.png',
            //     options: []
            // },
            {
                category: 'logic',
                type: 'when',
                title: formatMessage('When'),
                defaultText: formatMessage('When'),
                icon: 'assets/icons/flow/diagram/when.png',
                options: [
                    {
                        name: 'expression',
                        defaultValue: '${body}'
                    },
                    {
                        name: 'whenOrder',
                        defaultValue: '1'
                    },
                ]
            },
            {
                category: 'logic',
                type: 'otherwise',
                title: formatMessage('Otherwise'),
                defaultText: formatMessage('Otherwise'),
                icon: 'assets/icons/flow/diagram/otherwise.png',
                options: []
            },
            {
                category: 'logic',
                type: 'loop',
                title: formatMessage('Loop'),
                defaultText: formatMessage('Loop'),
                icon: 'assets/icons/flow/diagram/loop.png',
                options: [
                    {
                        name: 'mode',
                        defaultValue: 'Count'
                    },
                    {
                        name: 'count',
                        defaultValue: '1'
                    },
                    {
                        name: 'expression',
                        defaultValue: '${body}'
                    },
                ]
            },
            // {
            //     category: 'logic',
            //     type: 'loopEnd',
            //     title: 'Loop End',
            //     defaultText: 'Loop End',
            //     icon: 'assets/icons/flow/diagram/otherwiseEnd.png',
            //     options: [
            //         {
            //             name: 'startId',
            //             defaultValue: ''
            //         },
            //     ]
            // },
            {
                category: 'producer',
                type: 'directProducer',
                title: formatMessage('DirectProducer'),
                defaultText: formatMessage('DirectProducer'),
                icon: 'assets/icons/flow/diagram/direct_p.png',
                options: [
                    {
                        name: 'flowName',
                        defaultValue: ''
                    },
                ]
            },
            /*{
                category: 'producer',
                type: 'kafkaProducer',
                title: formatMessage('KafkaProducer'),
                defaultText: formatMessage('KafkaProducer'),
                icon: 'assets/icons/flow/diagram/kafka_p.png',
                options: [
                    {
                        name: 'topic',
                        defaultValue: 'topic-001'
                    },
                    {
                        name: 'brokers',
                        defaultValue: 'localhost:9092'
                    },
                    {
                        name: 'requestRequiredAcks',
                        defaultValue: ''
                    },
                    {
                        name: 'retries',
                        defaultValue: '1'
                    }
                ]
            },*/
            {
                category: 'producer',
                type: 'fileProducer',
                title: formatMessage('FileProducer'),
                defaultText: formatMessage('FileProducer'),
                icon: 'assets/icons/flow/diagram/file_p.png',
                options: [
                    {
                        name: 'fileName',
                        defaultValue: 'fileName.txt'
                    },
                    {
                        name: 'filePath',
                        defaultValue: '/home/rocky/files'
                    },
                    {
                        name: 'fileExist',
                        defaultValue: 'Override'
                    }
                ]
            },
            {
                category: 'producer',
                type: 'httpProducer',
                title: formatMessage('RestProducer'),
                defaultText: formatMessage('RestProducer'),
                icon: 'assets/icons/flow/diagram/rest_c.png',
                options: [
                    {
                        name: 'externalApis',
                        defaultValue: ''
                    },
                    {
                        name: 'apiType',
                        defaultValue: ''
                    },
                    {
                        name: 'dataFormat',
                        defaultValue: ''
                    },
                    {
                        name: 'httpMethod',
                        defaultValue: 'POST'
                    },
                    {
                        name: 'requestUrl',
                        defaultValue: 'http://localhost'
                    },
                    {
                        name: 'headers',
                        defaultValue: [
                            {
                                id: uuidv4(),
                                name: 'Accept',
                                value: 'application/json'
                            },
                            {
                                id: uuidv4(),
                                name: 'Content-Type',
                                value: 'application/json'
                            }
                        ]
                    },
                    {
                        name: 'body',
                        defaultValue: ''
                    },
                    {
                        name: 'parameters',
                        defaultValue: []
                    },
                ]
            },
            {
                category: 'producer',
                type: 'sql',
                title: formatMessage('Sql'),
                defaultText: formatMessage('Sql'),
                icon: 'assets/icons/flow/diagram/sql.png',
                options: [
                    {
                        name: 'query',
                        defaultValue: 'SELECT * FROM movie;'
                    },
                    {
                        name: 'dataSource',
                        defaultValue: ''
                    },
                    {
                        name: 'batch',
                        defaultValue: 'false'
                    },
                ]
            },
            {
                category: 'marshaler',
                type: 'marshal',
                title: formatMessage('JSONMarshal'),
                defaultText: formatMessage('JSONMarshal'),
                icon: 'assets/icons/flow/diagram/json.png',
                options: []
            },
            {
                category: 'marshaler',
                type: 'unmarshal',
                title: formatMessage('JSONUnmarshal'),
                defaultText: formatMessage('JSONUnmarshal'),
                icon: 'assets/icons/flow/diagram/json.png',
                options: []
            },
            {
                category: 'marshaler',
                type: 'xmlMarshal',
                title: formatMessage('XMLMarshal'),
                defaultText: formatMessage('XMLMarshal'),
                icon: 'assets/icons/flow/diagram/xml.png',
                options: []
            },
            {
                category: 'marshaler',
                type: 'xmlUnmarshal',
                title: formatMessage('XMLUnmarshal'),
                defaultText: formatMessage('XMLUnmarshal'),
                icon: 'assets/icons/flow/diagram/xml.png',
                options: []
            },
            {
                category: 'aop',
                type: 'throwException',
                title: formatMessage('ThrowException'),
                defaultText: formatMessage('ThrowException'),
                icon: 'assets/icons/flow/diagram/throwException.png',
                options: [
                    {
                        name: 'exceptionType',
                        defaultValue: 'java.lang.Exception'
                    },
                    {
                        name: 'message',
                        defaultValue: 'Occurred a Error'
                    }
                ]
            },
            {
                category: 'aop',
                type: 'onException',
                title: formatMessage('OnException'),
                defaultText: formatMessage('OnException'),
                icon: 'assets/icons/flow/diagram/exception.png',
                options: [
                    {
                        name: 'exceptionType',
                        defaultValue: 'java.lang.Exception'
                    }
                ]
            },
            {
                category: 'aop',
                type: 'onCompletion',
                title: formatMessage('OnCompletion'),
                defaultText: formatMessage('OnCompletion'),
                icon: 'assets/icons/flow/diagram/onCompletion.png',
                options: []
            }
        ];
    }

    public getNodeInfo(type) {
        return this.getNodeInfos().find(node => node.type === type);
    }

    public initNodeOptions(node) {
        node.options = {};
        this.getNodeInfo(node.type).options.forEach(option => {
            node.options[option.name] = option.defaultValue;
        });
    }

    public isConsumer(type) {
        return type === 'directConsumer' ||
            type === 'file' || type === 'rest' || type === 'scheduler' || type === 'kafka';
    }

    public getConsumerNode(flow) {
        const consumerNode = flow.diagram.nodes.find(node => this.isConsumer(node.type));
        return consumerNode;
    }

}
