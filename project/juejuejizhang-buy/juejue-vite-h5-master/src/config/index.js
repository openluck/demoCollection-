const MODE = import.meta.env.MODE // 环境变量

// export const baseUrl = MODE == 'development' ? '/api' : 'http://api.chennick.wang'
export const baseUrl = MODE == 'development' ? '/api' : 'http://10.0.12.14:7009'