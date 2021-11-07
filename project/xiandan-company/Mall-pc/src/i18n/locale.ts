export interface I18nLocalWebHeader {
    title: string;
    index: string;
    nav: string[];
}

export interface I18nLocalWebFooter {
    specialty: object[],
    nav: any[],
    desc: string,
    code: string,
    rules: any[],
    companyName: string,
}

export interface I18nLocalHome {
    tide: string,
    optimization: string,
    more: string,
    discountProduct: string,
    hotSell: string,
    recommend: string,
    activity:string,
    activeTitle: string,
    end: string,
    index:string,
    all:string,
}

export interface I18nLocalSearch {
    placeHolder: string,
    search: string,
    cart: string,
    index: string,
    all: string,
    searchResult: string,
    result1: string,
    result2: string,
    none: string,
}

export interface I18nLocalCommodity {
    countries:string,
    types: string,
    comprehensiveSort: string,
    sortLowest: string,
    sortHighest: string,
    price: string,
    sure: string,
    pre: string,
    next: string,
    priceWarn:string,
    all:string,
    index:string,
    result:string,
    result1: string,
    result2: string,
    none: string,
    placeHolder: string,
    search: string,
    cart: string,
    searchResult: string,
    commodityNone: string,
    searchNone: string,
}

export interface I18nLocalCommodityDetail {
    detail: string,
    sell: string,
    add: string,
    price: string,
    carriage: string,
    carriageInfo: string,
    count: string,
    collection: string,
    warnInt:string,
    warnMost:string,
}

export interface  I18nLocalCommodityList {
    source: string[],
    sellCount:string,
}

export interface I18nLocalCommodityNone {
    none:string,
}

export interface I18nLocalTargetBar {
    all:string,
    index:string,
    result:string,
}

export interface I18nLocalCompanyResume {
    aboutTitle: string,
    aboutDesc: string,
    progress: string,
    progressInfo: any[],
    timeList: any[],
    contact: string,
    contactAddress: string,
}

export interface I18nLocalPlatform {
    name: string,
    title: string,
    photo: string,
    person: string,
    phone: string,
    email: string,
    scope: string,
    sellTitle: string,
    sellNumber: string,
    sellTotal: string,
    isECommerce: string,
    yes: string,
    no: string,
    upload: string,
    uploadText: string,
    submit: string,
    succeed: string,
    after: string,
    please: string,
}

export interface I18nLocalInformationList {
    beginnerGuide:string,
    beginnerGuideItem:any[],
    questions:string
    questionsItem:any[]
    logistics:string,
    logisticsItem:any[],
    aboutUs:string,
    aboutUsItem:any[],
}

export interface I18nLocalBuyingGuide {
    title: string,
    loginTitle:string,
    loginStep:string[],
    addTitle:string,
    addStep:string[],
    submitTitle:string,
    submitStep:string[],
    payTitle:string,
    payStep:string[],
    lookTitle:string,
    lookStep:string[],
    statusTitle:string,
    statusStep:string[]
}

export interface I18nLocalPayWay {
    title: string,
    payWayTile: string,
    payWay: string,
}

export interface I18nLocalAttestation {
    title: string,
    whyTitle: string,
    whyDesc: string,
    howTitle: string,
    howDesc: any[],
}

export interface I18nLocalTariff {
    titleTariff: string,
    titleCustomsPolicy: string,
    question: string,
    info: any[],
    tips: string,
    focus: string,
    slogan: string,
}

export interface I18nLocalNotification {
    title: string,
    info: any[]
}

export interface I18nLocalServiceAgreement {
    title: string,
    info:string[],
    mallTitle: string,
    mallInfo: string,
    normTitle: string,
    normInfo: string[],
    useTitle: string,
    useInfo: string[],
    otherTitle: string,
    otherInfo: string[],
}

export interface I18nLocalPackaging {
    title: string,
    info: string[],
}

export interface I18nLocalEntrust {
    title: string,
    info: string,
}

export interface I18LocalCompanyProfile {
    title: string,
    aboutHope: any[],
    hopeTitle:string,
    hopeInfo: string,
    more: string[],
    imgList: string,
}

export interface I18nLocalLogisticsTracking {
    title: string,
    info: string[],
}

export interface I18nLocalFreightBase {
    title: string,
    info: string[],
    announcements: string[]
}

export interface I18nLocalDistributionMode {
    title: string,
    bonded: string,
    info: string[],
    announcements: string[],
}

export interface I18nLocalDistributionService {
    title: string,
    serviceName: string,
    areaTitle: string,
    serviceMean: string[],
    serviceArea: any[],
    other: string,
    otherInfo: string,
}

export interface I18nLocalCustomizeLogistics {
    title: string,
    foreword: string[],
    info: any[]
}

export interface I18nLocalTaxRate {
    title: string,
    info: string[],
    tableTitle: any[],
    tableInfo: any[],
}