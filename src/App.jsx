import { Children, cloneElement, createContext, isValidElement, useContext, useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from './api.js'
import {
  Activity, ArrowRight, Bell, BookOpen, Check,
  ChevronDown, ChevronLeft, ChevronRight, Cloud, CloudDrizzle, CloudRain, CloudSun,
  Droplets, Feather, Heart, Leaf, LogOut, Menu, Plus,
  Search, Settings, ShieldCheck, ShoppingBag, Sprout, Sun, Thermometer,
  TrendingUp, Users, Wheat, Wind, X, LayoutDashboard, MapPin, CircleHelp,
  Clock3, CalendarDays, BadgeCheck, CircleDot, ExternalLink, LockKeyhole,
  Mail, Eye, EyeOff, ImagePlus, Pencil, Trash2, UserRound, MoreHorizontal, BarChart3, Tractor, Sparkles, CheckCircle2, Info, Languages,
} from 'lucide-react'

const districts = ['Maseru', 'Berea', 'Leribe', 'Butha-Buthe', 'Mokhotlong', 'Thaba-Tseka', 'Mafeteng', 'Mohale’s Hoek', 'Quthing', 'Qacha’s Nek']
const LocaleContext = createContext('en')
const sesothoText = {
  'YOUR FARM': 'POLASI YA HAO',
  'YOUR COMMUNITY': 'SETJHABA SA HAO',
  ACCOUNT: 'AKHAONTO',
  ADMINISTRATION: 'TSAMAISO',
  Overview: 'Kakaretso',
  Weather: 'Boemo ba lehodimo',
  'Crop prices': 'Ditheko tsa dijalo',
  'Alerts & protection': 'Ditemoso le tshireletso',
  'Market prices': 'Ditheko tsa mmaraka',
  'Retail food prices by market': 'Ditheko tsa dijo mmarakeng',
  'LATEST RETAIL PRICE OBSERVATIONS': 'DITHEKO TSA MORAORAO TSA THEKISO',
  'Latest recorded retail food prices by market in Lesotho. They are consumer prices—not what farmers receive when selling crops.': 'Ditheko tsa moraorao tse tlalehilweng mabenkeleng a dijo Lesotho. Ke ditheko tsa bareki, eseng tseo barapolasi ba di fumanang ha ba rekisa dijalo.',
  'Select market': 'Kgetha mmaraka',
  'All markets': 'Mebaraka yohle',
  'Loading verified prices…': 'Ho jarollwa ditheko tse netefaditsweng…',
  'Latest observation': 'Tekanyo ya moraorao',
  'View source': 'Sheba mohlodi',
  'No recent verified prices are available for this market.': 'Ha ho ditheko tse ntjha tse netefaditsweng tse fumanehang mmarakeng ona.',
  'Market price data could not be loaded.': 'Dintlha tsa ditheko tsa mmaraka ha di a jarollwa.',
  'FOOD / COMMODITY': 'DIJO / SEHLAHISOA',
  'RETAIL PRICE': 'THEKO YA THEKISO',
  MARKET: 'MMARAKA',
  OBSERVED: 'LETSATSI LA TEKANYO',
  'Retail prices are not farm-gate prices. Check price, grade and buyer terms locally before selling.': 'Ditheko tsa thekiso ha se ditheko tsa polasing. Netefatsa theko, boleng le dipehelo tsa moreki sebakeng sa heno pele o rekisa.',
  'Only actual retail observations from the last 90 days are shown.': 'Ho bontshwa ditheko tsa nnete tsa thekiso tsa matsatsi a 90 a morao feela.',
  'Source: World Food Programme (WFP) Price Database, via Lesotho Bureau of Statistics and FAO GIEWS.': 'Mohlodi: Lenane la Ditheko la WFP, ka Lesotho Bureau of Statistics le FAO GIEWS.',
  'Distributed by HDX · CC BY-IGO 3.0': 'E phatlaladitswe ke HDX · CC BY-IGO 3.0',
  'See all retail prices': 'Sheba ditheko tsohle tsa thekiso',
  'Loading market prices…': 'Ho jarollwa ditheko tsa mmaraka…',
  'No recent retail observations for this district.': 'Ha ho ditheko tsa moraorao tsa thekiso seterekeng sena.',
  'Latest observations in': 'Ditheko tsa moraorao ho',
  'Notifications are not delivered yet.': 'Ditsebiso ha di romelwe hona jwale.',
  'Wheat flour': 'Phofo ya koro',
  'Beans (sugar-red)': 'Dinawa tse kgubedu',
  'Peas (split, dry)': 'Dierekisi tse omisitsweng tse arotsweng',
  'Oil (sunflower)': 'Oli ya sonobolomo',
  'Bread (brown)': 'Bohobe bo sootho',
  Rice: 'Raese',
  'Maize meal (imported)': 'Phofo ya poone e tswang kantle',
  'Wheat meal': 'Phofo ya koro',
  Administration: 'Tsamaiso',
  'Fresh produce': 'Dihlahiswa tse foreshe',
  Cooperative: 'Koporasi',
  'Success stories': 'Dipale tsa katleho',
  'Farming resources': 'Tsebo ya temo',
  'My profile': 'Boemo ba ka',
  Settings: 'Dipeakanyo',
  'Admin dashboard': 'Dashboard ya tsamaiso',
  'SELL WITH CONFIDENCE': 'REKISA KA KGODISEHO',
  'Know what your produce is worth.': 'Tseba boleng ba dihlahiswa tsa hao.',
  'Save alert preference': 'Boloka kgetho ya ditsebiso',
  'Sign in for price alerts': 'Kena bakeng sa ditsebiso tsa ditheko',
  'Join the cooperative': 'Eba setho sa koporasi',
  'Meet the people nearby, share what you grow, and get more of your produce to market together.': 'Kopana le batho ba heno, arolelana seo o se lemang, mme le ise dihlahiswa mmarakeng mmoho.',
  'OUR STRENGTH IS IN EACH OTHER': 'MATLA A RONA A HO E MONG LE E MONG',
  'KNOWLEDGE FOR EVERY SEASON': 'TSEBO YA SEHLA SENG LE SENG',
  'A little know-how goes a long way.': 'Tsebo e nyenyane e thusa haholo.',
  'Practical, easy-to-follow ideas from the farming community, made for growing in Lesotho.': 'Dikeletso tse sebetsang le tse bonolo tse tswang setjhabeng sa temo sa Lesotho.',
  'COOPERATIVE ADMINISTRATION': 'TSAMAISO YA KOPORASI',
  'Manage the people who grow together.': 'Tsamaisa batho ba lemang mmoho.',
  'Review registered accounts, publish cooperative announcements, and help members keep their records up to date.': 'Sheba diakhaonto tse ngodisitsweng, phatlalatsa ditsebiso tsa koporasi, mme o thuse ditho ho ntjhafatsa direkoto tsa tsona.',
  'A home for your farm.': 'Lehae la polasi ya hao.',
  'Keep your contact and farm details up to date so your cooperative can keep you in the loop.': 'Ntjhafatsa dintlha tsa hao tsa puisano le polasi hore koporasi e o tsebise.',
  'MAKE IT YOURS': 'E ETSE YA HAO',
  'The details, just right.': 'Dipeakanyo tse loketseng.',
  'A few simple preferences help keep AgriVision useful for you and your farm.': 'Dipeakanyo tse mmalwa di thusa ho etsa hore AgriVision e o sebeletse hantle polasing.',
  'Be ready before the weather turns.': 'Itokise pele boemo ba lehodimo bo fetoha.',
  'Warnings are worked out from the live 7-day forecast for your district, with simple ways to protect your crops and farm.': 'Ditemoso di thehilwe ponelopele ya matsatsi a 7 ya setereke sa heno, ka ditsela tse bonolo tsa ho sireletsa dijalo le polasi.',
  'Prices are researched and updated by the cooperative administrator. Check the date on each grade.': 'Ditheko di batlisiswa le ho ntjhafatswa ke motsamaisi wa koporasi. Sheba letsatsi la sehlopha ka seng.',
  'What our crops are worth.': 'Boleng ba dijalo tsa rona.',
  'Prices are researched and updated by the cooperative administrator. Check the date on each card.': 'Ditheko di batlisiswa le ho ntjhafatswa ke motsamaisi wa koporasi. Sheba letsatsi kareteng ka nngwe.',
  'SUCCESS STORIES': 'DIPALE TSA KATLEHO',
  'Farmers who are growing Lesotho.': 'Barapolasi ba hodisang Lesotho.',
  'Stories from our cooperative and community.': 'Dipale tse tswang koporaseng le setjhabeng sa rona.',
  'Add a crop': 'Kenya sejalo',
  'Add a story': 'Kenya pale',
  'TODAY': 'KAJENO',
  '3 days': 'Matsatsi a 3',
  '7 days': 'Matsatsi a 7',
  '6 months': 'Dikgwedi tse 6',
  '3 months': 'Dikgwedi tse 3',
  'Clear sky': 'Lehodimo le hlwekile',
  'Partly cloudy': 'Maru a mang',
  Overcast: 'Lehodimo le apesitswe ke maru',
  Fog: 'Mohodi',
  Drizzle: 'Pula e nyenyane',
  'Rain showers': 'Dipula',
  Snowfall: 'Lehloa',
  Thunderstorm: 'Sefefo sa seaduma',
  'Conditions unavailable': 'Boemo ha bo fumanehe',
  'Live conditions unavailable': 'Boemo ba hona jwale ha bo fumanehe',
  'Checking the skies…': 'Ho hlahlojwa lehodimo…',
  'No live reading for': 'Ha ho tekanyo ya hona jwale bakeng sa',
  'No poverty': 'Ha ho bofuma',
  'Zero hunger': 'Tlala e fedile',
  'Climate action': 'Mohato wa boemo ba lehodimo',
  'Responsible production': 'Tlhahiso e nang le boikarabelo',
  Home: 'Lehae',
  Browse: 'Sheba',
  Community: 'Setjhaba',
  Profile: 'Boemo',
  Lesotho: 'Lesotho',
  'Here for your farm': 'Re teng bakeng sa polasi ya hao',
  'Questions? Our community team is a message away.': 'O na le dipotso? Sehlopha sa rona sa setjhaba se ka o thusa.',
  'Get support': 'Kopa thuso',
  'Welcome, farmer': 'Rea o amohela, rapolasi',
  'Farmer account': 'Akhaonto ya rapolasi',
  'Farmer sign in': 'Kena jwalo ka rapolasi',
  'Admin sign in': 'Kena jwalo ka motsamaisi',
  'Farmer sign in.': 'Kena jwalo ka rapolasi.',
  'Administrator sign in.': 'Kena jwalo ka motsamaisi.',
  'Use your approved cooperative administrator email and password.': 'Sebedisa imeile le phasewete tsa motsamaisi wa koporasi e dumelletsweng.',
  'Sign in with your farmer account, or create a free account.': 'Kena ka akhaonto ya hao ya rapolasi, kapa o iketsetse akhaonto ya mahala.',
  'Let’s grow something together.': 'A re holeng mmoho.',
  'Create a farmer account to get started.': 'Iketsetse akhaonto ya rapolasi ho qala.',
  'Your full name': 'Lebitso la hao ka botlalo',
  'Your farm or grower group': 'Lebitso la polasi ya hao kapa sehlopha sa balemi',
  'you@example.com': 'lebitso@mohlala.com',
  'name@gmail.com': 'lebitso@gmail.com',
  'EMAIL ADDRESS': 'IMEILE YA HAO',
  PASSWORD: 'PHASEWETE',
  'Your password': 'Phasewete ya hao',
  'At least 12 characters': 'Bonyane ditlhaku tse 12',
  'Show password': 'Bontsha phasewete',
  'Hide password': 'Pata phasewete',
  'Enter your full name (at least 2 letters).': 'Kenya lebitso la hao ka botlalo (bonyane ditlhaku tse 2).',
  'Enter your farm or group name.': 'Kenya lebitso la polasi kapa sehlopha sa hao.',
  'Enter a valid email, like name@example.com.': 'Kenya imeile e nepahetseng, jwalo ka lebitso@mohlala.com.',
  'Farmers must use a Gmail address ending in @gmail.com.': 'Barapolasi ba lokela ho sebedisa imeile ya Gmail e qetellang ka @gmail.com.',
  'Enter your password.': 'Kenya phasewete ya hao.',
  'Include letters and at least one number.': 'Kenyelletsa ditlhaku le bonyane nomoro e le nngwe.',
  'Use 12 or more characters, with letters and a number.': 'Sebedisa ditlhaku tse 12 kapa ho feta, tse nang le ditlhaku le nomoro.',
  'Please fix the boxes marked in red.': 'Lokisa mabokose a tshwailweng ka bokgubedu.',
  'Sign in as administrator': 'Kena jwalo ka motsamaisi',
  'Sign in as farmer': 'Kena jwalo ka rapolasi',
  'Create farmer account': 'Iketsetse akhaonto ya rapolasi',
  'Please wait…': 'Ema hanyane…',
  'New to AgriVision? Create a farmer account': 'O motjha ho AgriVision? Iketsetse akhaonto ya rapolasi',
  'Farmer sign-in / create account': 'Kena kapa o iketsetse akhaonto ya rapolasi',
  'Already registered? Sign in': 'O se o ngodisitse? Kena',
  'Initial cooperative administrator setup': 'Tlhophiso ya motsamaisi wa pele wa koporasi',
  Close: 'Kwala',
  'First-admin setup will be available once the Atlas connection is fixed.': 'Tlhophiso ya motsamaisi wa pele e tla fumaneha ha khokahano ya Atlas e lokisitswe.',
  'Sign-in is temporarily unavailable until the production database is connected.': 'Ho kena ha ho fumanehe nakwana ho fihlela database ya tlhahiso e hoketswe.',
  'Atlas is rejecting the database connection. Check the database username and password stored in Vercel; keep them private.': 'Atlas ha e amohele khokahano ya database. Sheba lebitso la mosebedisi le phasewete tsa database ho Vercel, mme o di boloke e le lekunutu.',
  'Email or password is incorrect.': 'Imeile kapa phasewete ha e a nepahala.',
  'Change language': 'Fetola puo',
  English: 'Senyesemane',
  'YOUR FARM, AT A GLANCE': 'POLASI YA HAO KA KAKARETSO',
  'Growing together,': 'Ho hola mmoho,',
  'farming smarter.': 'ho lema ka bohlale.',
  'Explore your community': 'Sheba setjhaba sa heno',
  'Co-op neighbours': 'Baahisani ba koporasi',
  'Produce shared': 'Dihlahiswa tse arolelanoeng',
  'Current weather': 'Boemo ba lehodimo hona jwale',
  'Growing guides': 'Ditaelo tsa temo',
  'Full forecast': 'Ponelopele yohle',
  'Market watch': 'Tlhokomelo ya mmaraka',
  'From the community': 'Ho tswa setjhabeng',
  'Co-op noticeboard': 'Tsebiso tsa koporasi',
  'Get started': 'Qala',
  'Weather for your farm': 'Boemo ba lehodimo polasing ya hao',
  'Your cooperative, your community.': 'Koporasi ya hao, setjhaba sa hao.',
  'Sign in to continue.': 'Kena hore o tswele pele.',
  'Explore the guide': 'Sheba tataiso',
  'Share produce': 'Arolelana dihlahiswa',
  'Add announcement': 'Kenya tsebiso',
  'Save changes': 'Boloka diphetoho',
  'Sign out': 'Tsoa',
  'Cancel': 'Hlakola',
  'Save': 'Boloka',
  'Done': 'Qetile',
  'Search produce…': 'Batla dihlahiswa…',
  'No produce listed yet': 'Ha ho dihlahiswa tse thathamisitsweng',
  'Vegetables': 'Meroho',
  'Climate smart': 'Temo e mamellang maemo a lehodimo',
  'Today': 'Kajeno',
  'Updating…': 'E a ntjhafatswa…',
  'Live data unavailable': 'Dintlha tsa hona jwale ha di fumanehe',
  'No forecast available': 'Ha ho ponelopele e fumanehang',
  'Try again later.': 'Leka hape ha morao.',
  'YOUR ACCOUNT': 'AKHAONTO YA HAO',
  'YOUR LOCAL FORECAST': 'PONOELEPELE YA HENO',
  'A little look at the skies': 'Sheba boemo ba lehodimo',
  'THE LATEST': 'TSE NTJHA',
  'GROWING STRONGER TOGETHER': 'HO MATLA MMOHO',
  'Meet your co-op': 'Kopana le koporasi ya heno',
  'Good things grow together.': 'Dintho tse ntle di hola mmoho.',
  'All updates': 'Ditsebiso tsohle',
  'YOUR FARM, YOUR RECORDS': 'POLASI YA HAO, DIREKOTO TSA HAO',
  'Checking your account…': 'Ho hlahlojwa akhaonto ya hao…',
  'Administrator access only.': 'Motsamaisi feela a ka kena.',
  'Sign in with an approved cooperative administrator account to view this page.': 'Kena ka akhaonto e dumelletsweng ya motsamaisi wa koporasi ho sheba leqephe lena.',
  'Registered cooperative members': 'Ditho tse ngodisitsweng tsa koporasi',
  'Illustrative community total': 'Palo ya mohlala ya setjhaba',
  'Loading district forecast': 'Ho jarollwa ponelopele ya setereke',
  'Practical farming resources': 'Dikeletso tse sebetsang tsa temo',
  'Growing stronger together': 'Ho matlafala mmoho',
  'Farmers & administrators': 'Barapolasi le batsamaisi',
  'PLAN WITH THE SKY': 'RERA LEHODIMO',
  'Live district forecast from Open-Meteo. Forecasts are guidance, not official severe-weather alerts.': 'Ponelopele ya setereke e tswang ho Open-Meteo. Ke tataiso feela, ha se temoso ya semmuso ya maemo a kotsi.',
  'YOUR DISTRICT': 'SETIKEKE SA HAO',
  'Forecast period': 'Nako ya ponelopele',
  'THE DAYS AHEAD': 'MATSATSI A TLANG',
  'A THOUGHT FOR YOUR FARM': 'KELETSO BAKENG SA POLASI YA HAO',
  'WEATHER WATCH': 'TEKOLO YA LEHODIMO',
  'Forecast data, not warnings': 'Dintlha tsa ponelopele, eseng ditemoso',
  'Check official alerts separately': 'Sheba ditemoso tsa semmuso ka thoko',
  'FRESH FROM LESOTHO FARMS': 'TSWA DIPHOLASING TSA LESOTHO',
  'Fresh picks for you': 'Dihlahiswa tse foreshe bakeng sa hao',
  'THE FARMER’S MARKET': 'MMARAKA WA BARAPOLASI',
  'Search produce': 'Batla dihlahiswa',
  'All produce': 'Dihlahiswa tsohle',
  'Demonstration marketplace.': 'Mmaraka wa pontsho.',
  'Your basket': 'Seroto sa hao',
  'Example total': 'Kakaretso ya mohlala',
  'Review basket': 'Sheba seroto',
  'Good food.': 'Dijo tse monate.',
  'Grown close to home.': 'Di lengwang haufi le hae.',
  'Browse local produce and support the people who grow it.': 'Sheba dihlahiswa tsa lehae mme o tshehetse batho ba di lemang.',
  'Local farmer listings': 'Manane a barapolasi ba lehae',
  'Listings, seller names and prices are examples only—not real offers or live availability.': 'Manane, mabitso a barekisi le ditheko ke mehlala feela—ha se ditlhahiso kapa fumaneha ha nnete.',
  'Filter produce': 'Sefa dihlahiswa',
  Grains: 'Mabele',
  'Grains & oilseeds': 'Mabele le dipeo tsa oli',
  'Example produce listings': 'Manane a mohlala a dihlahiswa',
  SAMPLE: 'MOHLALA',
  'Garden tomatoes': 'Ditamati tsa serapeng',
  'Fresh potatoes': 'Ditapole tse foreshe',
  'Maize meal': 'Phofo ya poone',
  'Leafy greens': 'Meroho e metala',
  'Local grower': 'Molemi wa lehae',
  'Family farm': 'Polasi ya lelapa',
  'Community mill': 'Mochini wa setjhaba',
  'Market garden': 'Serapa sa mmaraka',
  'example seller': 'morekisi wa mohlala',
  Add: 'Kenya',
  'Remove one': 'Tlosa e le nngwe',
  'Add another': 'Kenya e nngwe',
  'No produce found': 'Ha ho dihlahiswa tse fumanweng',
  'Try another search or category.': 'Leka ho batla ka mokgwa o mong kapa sehlopha se seng.',
  example: 'mohlala',
  item: 'ntho',
  items: 'dintho',
  'Your basket is waiting.': 'Seroto sa hao se emetse.',
  'Add a sample listing to see how the basket works.': 'Kenya lenane la mohlala ho bona kamoo seroto se sebetsang.',
  'Checkout is not connected. No order has been placed; these are example listings.': 'Tefo ha e a hokahanngwa. Ha ho odara e entsweng; ana ke manane a mohlala.',
  'Saved lists are not connected in this demonstration.': 'Manane a bolokilweng ha a hokahanngwa pontshong ena.',
  'added to your demo basket': 'e kentsoe serotong sa hao sa mohlala',
  'to saved produce': 'ho dihlahiswa tse bolokilweng',
  '10 kg bag': 'mokotla wa 10 kg',
  '50 kg bag': 'mokotla wa 50 kg',
  crate: 'kreiti',
  bunch: 'sephuthelwana',
  head: 'hlooho',
  each: 'e le nngwe',
  All: 'Tsohle',
  Fruit: 'Ditholwana',
  Legumes: 'Dinawa',
  'Root crops': 'Dijalo tsa metso',
  'Not yet researched': 'Ha e so batlisiswe',
  'Price available': 'Theko e teng',
  'Not yet available in Lesotho': 'Ha e so fumanehe Lesotho',
  'Price not researched yet': 'Theko ha e so batlisiswe',
  'Not yet available in our country': 'Ha e so fumanehe naheng ya rona',
  per: 'ka',
  Updated: 'E ntjhafaditswe',
  Apples: 'Liapole',
  Apricots: 'Diapolekose',
  Grapes: 'Morara',
  Peaches: 'Diperekisi',
  Pears: 'Dipere',
  Plums: 'Dipolamo',
  Strawberries: 'Fragole',
  Watermelon: 'Lehapu',
  Barley: 'Harese',
  Canola: 'Kanola',
  Maize: 'Poone',
  Oats: 'Habore',
  Sorghum: 'Mabele',
  Soybeans: 'Dinawa tsa soya',
  Sunflower: 'Sonobolomo',
  Wheat: 'Koro',
  'Dry beans': 'Dinawa tse omisitsweng',
  'Green beans': 'Dinawa tse tala',
  Groundnuts: 'Matokomane',
  Peas: 'Dierekisi',
  Potatoes: 'Ditapole',
  Radish: 'Radishe',
  'Sweet potatoes': 'Ditapole tse tswekere',
  Turnips: 'Dithurnip',
  Beetroot: 'Bete',
  Broccoli: 'Brokoli',
  Butternut: 'Mokopu wa butternut',
  Cabbage: 'Khabeche',
  Carrots: 'Dihwete',
  Cauliflower: 'Khouliflower',
  Celery: 'Seleri',
  Chillies: 'Ditshilisi',
  Cucumber: 'Dikomokomore',
  Eggplant: 'Semela sa eggplant',
  Garlic: 'Konofolo',
  'Green peppers': 'Diperepere tse tala',
  Leeks: 'Liki',
  Lettuce: 'Letasi',
  Onions: 'Eiee',
  Pumpkin: 'Mokopu',
  Spinach: 'Sepinichi',
  'Sweet corn': 'Poone e tswekere',
  'Swiss chard': 'Sepinichi sa Swiss',
  'Search crops': 'Batla dijalo',
  'Loading crops…': 'Ho jarollwa dijalo…',
  'No crops match your search.': 'Ha ho dijalo tse tsamaellanang le seo o se batlang.',
  'Photos come from Wikipedia and Wikimedia Commons, or are added by the administrator.': 'Ditshwantsho di tswa Wikipedia le Wikimedia Commons, kapa di kenngwa ke motsamaisi.',
  'CROP NAME': 'LEBITSO LA SEJALO',
  CATEGORY: 'SEHLOPHA',
  STATUS: 'BOEMO',
  'PRICE (MALOTI)': 'THEKO (MALOTI)',
  PER: 'KA',
  'NOTE (OPTIONAL)': 'TLHOKOMELISO (HA E TLAMEHE)',
  'PHOTO LINK (OPTIONAL)': 'SEHOKELO SA SETSHWANTSHO (HA SE TLAMEHE)',
  'Crop name': 'Lebitso la sejalo',
  Category: 'Sehlopha',
  Status: 'Boemo',
  'Price (Maloti)': 'Theko (Maloti)',
  'Note (optional)': 'Tlhokomeliso (ha e tlamehe)',
  'Photo link (optional)': 'Sehokelo sa setshwantsho (ha se tlamehe)',
  'Enter the crop name.': 'Kenya lebitso la sejalo.',
  'Enter a price, or change the status.': 'Kenya theko, kapa o fetole boemo.',
  'e.g. Not yet available in our country, or where the price was researched': 'mohlala: Ha e so fumanehe naheng ya rona, kapa moo theko e batlisisitsweng',
  'https://…  (leave empty to use the automatic photo)': 'https://… (tlohela sekgeo sena se se na letho ho sebedisa setshwantsho sa othomathiki)',
  'Crop saved': 'Sejalo se bolokilwe',
  'Crop removed': 'Sejalo se tlositswe',
  'Remove crop': 'Tlosa sejalo',
  Remove: 'Tlosa',
  'from the list?': 'lenaneng?',
  'Edit': 'Fetola',
  'Saving…': 'E a bolokwa…',
  'Meet your fellow farmers': 'Kopana le barapolasi ba heno',
  'GOOD NEIGHBOURS, GOOD GROWERS': 'BAAHISANI BA MOLEMO, BARAPOLASI BA MOLEMO',
  'BRINGING GOOD THINGS TOGETHER': 'HO KOPANYA TSE MOLEMO',
  'Produce available for group marketing': 'Dihlahiswa tse fumanehang bakeng sa papatso ya sehlopha',
  'No members found': 'Ha ho ditho tse fumanweng',
  'No guides found': 'Ha ho ditaelo tse fumanweng',
  'Try a different search or category.': 'Leka ho batla ka mokgwa o mong kapa sehlopha se seng.',
  'Find a topic…': 'Batla sehlooho…',
  'Learn, grow, share.': 'Ithute, hola, arolelana.',
  'WELCOME TO AGRIVISION LESOTHO': 'REA O AMOHELA HO AGRIVISION LESOTHO',
  'Growing together, farming smarter.': 'Ho hola mmoho, ho lema ka bohlale.',
  'Create a farmer account': 'Iketsetse akhaonto ya rapolasi',
  'See crop prices': 'Sheba ditheko tsa dijalo',
  'WEATHER NOW': 'LEHODIMO HONA JWALE',
  'RAIN ALERTS': 'DITEMOSO TSA PULA',
  'CROP PRICES': 'DITEKO TSA DIJALO',
  'A good morning starts with a little more know-how. Here’s what’s happening across your farm and community.': 'Letsatsi le letle le qala ka tsebo. Bona se etsahalang polasing ya hao le setjhabeng.',
  'WEATHER FOR YOUR FARM': 'BOEMO BA LEHODIMO POLASING YA HAO',
  'Current conditions': 'Boemo ba lehodimo hona jwale',
  'LIVE CONDITIONS': 'BOEMO BA HONA JWALE',
  'CURRENT CONDITIONS': 'BOEMO BA HONA JWALE',
  'Feels like': 'E utlwahala jwalo ka',
  Humidity: 'Mongobo',
  Wind: 'Moya',
  'Cloud cover': 'Maru',
  'Share produce with your co-op': 'Arolelana dihlahiswa le koporasi ya heno',
  'Share with your community': 'Arolelana le setjhaba sa heno',
  'Add a listing to your cooperative.': 'Kenya lenane koporaseng ya heno.',
  'Share an opportunity with your co-op neighbours.': 'Arolelana monyetla le baahisani ba koporasi.',
  'PRODUCE TYPE': 'MOFUTA WA SEHLAHISWA',
  QUANTITY: 'PALO',
  UNIT: 'YUNITI',
  ANNOUNCEMENT: 'TSEBISO',
  DETAILS: 'DINTLHA',
  'Saved to your AgriVision account.': 'E bolokilwe akhaontong ya hao ya AgriVision.',
  'Share announcement': 'Arolelana tsebiso',
  '7-day forecast': 'Ponelopele ya matsatsi a 7',
  'Your farm statistics': 'Dipalopalo tsa polasi ya hao',
  'Maseru, Lesotho': 'Maseru, Lesotho',
  'Illustrative co-op total': 'Palo ya mohlala ya koporasi',
  'Forecast guidance is unavailable right now.': 'Tataiso ya ponelopele ha e fumanehe hona jwale.',
  'Use local conditions to plan outdoor work.': 'Sebelisa maemo a lehae ho rera mosebetsi wa kantle.',
  'farmers in your network': 'barapolasi marangrang a hao',
  OPEN: 'E BUTSWENG',
  'COMING UP': 'TSE TLANG',
  'Bring your produce to market as one. Your cooperative is stronger with you in it.': 'Isa dihlahiswa mmarakeng mmoho. Koporasi ya hao e ba matla ha o le setho.',
  'Grow with your community.': 'Hola le setjhaba sa heno.',
  'Create a farmer account to share produce and connect with your cooperative.': 'Iketsetse akhaonto ya rapolasi ho arolelana dihlahiswa le ho hokahana le koporasi ya hao.',
  'Growing towards a better future': 'Ho hola ho ya bokamosong bo betere',
  'A local platform with a global purpose.': 'Sethala sa lehae se nang le morero wa lefatshe lohle.',
  'Stronger market access': 'Phihlello e betere ya mmaraka',
  'More resilient harvests': 'Dijalo tse mamellang maemo hantle',
  'Less waste, healthier land': 'Tshenyo e fokolang, mobu o phetseng hantle',
  'Prepared for changing weather': 'Ho itokisetsa diphetoho tsa lehodimo',
  'LOCAL ACTION, SHARED GOALS': 'MOHATO WA LEHAE, MERERO E AROLELANWANG',
  'Small farms can move the world forward.': 'Mapolasi a manyane a ka isa lefatshe pele.',
  'AgriVision is designed to support the United Nations Sustainable Development Goals in practical ways that matter to Lesotho’s farming communities.': 'AgriVision e reretswe ho tshehetsa Merero ya Ntshetsopele e Tswellang ya Matjhaba a Kopaneng ka ditsela tse thusang setjhaba sa temo sa Lesotho.',
  'Help smallholders reach more buyers through cooperative marketing.': 'Thusa balemi ba banyane ho fumana bareki ba bangata ka papatso ya koporasi.',
  'Make practical growing advice and farm-management tools easier to find, share and use.': 'Etsa hore dikeletso tsa temo le disebediswa tsa tsamaiso ya polasi di fumanehe, di arolelanwe le ho sebediswa ha bonolo.',
  'Responsible consumption & production': 'Tsebediso le tlhahiso e nang le boikarabelo',
  'Support sustainable growing and better coordination to reduce farm waste.': 'Tshehetsa temo e tswellang le tshebedisano e betere ho fokotsa tshenyo ya polasi.',
  'Help farmers prepare for changing conditions with district weather information and climate-smart guidance.': 'Thusa barapolasi ho itokisetsa maemo a fetohang ka dintlha tsa lehodimo la setereke le tataiso ya temo e mamellang lehodimo.',
  'No verified update date': 'Ha ho letsatsi la nnete la ntjhafatso',
  'PRICE HISTORY · EXAMPLE DATA': 'NALANE YA DITHEKO · DINTLHA TSA MOHLALA',
  'market trend': 'diphetoho tsa mmaraka',
  'Seasonal mixed produce · example price': 'Dihlahiswa tse tswakilweng tsa sehla · theko ya mohlala',
  'per mixed crate': 'ka kreiti e tswakilweng',
  'over the last': 'matsatsing a fetileng a',
  'Sample data download is not connected yet.': 'Jarollo ya dintlha tsa mohlala ha e so hokahanngwe.',
  'Example price': 'Theko ya mohlala',
  'Lesotho (example)': 'Lesotho (mohlala)',
  'Illustrative only · actual prices vary by grade and buyer': 'Ke mohlala feela · ditheko tsa nnete di fapana ho ya ka maemo le moreki',
  'A SIMPLE SIDE-BY-SIDE': 'PAPISO E BONOLO',
  'Example buyer comparison': 'Papiso ya bareki ba mohlala',
  'ILLUSTRATIVE ONLY': 'MOHLALA FEELA',
  'A made-up example to show how comparing offers might look. These are not real buyers or current offers.': 'Mohlala o bontshang kamoo ho bapisa ditlhahiso ho ka shebahalang kateng. Bana ha se bareki kapa ditlhahiso tsa nnete.',
  'EXAMPLE BUYER': 'MOREKI WA MOHLALA',
  'VEGETABLES · PER CRATE': 'MEROHO · KA KREITI',
  COLLECTION: 'KOPANO',
  'District Market A': 'Mmaraka wa Setereke A',
  'Co-op Collection B': 'Pokello ya Koporasi B',
  'Example: Maseru': 'Mohlala: Maseru',
  'Example: Leribe': 'Mohlala: Leribe',
  'BEFORE YOU SELL': 'PELE O REKISA',
  'Every market tells a story.': 'Mmaraka o mong le o mong o na le pale.',
  'The price you receive can depend on quality, grade, season, distance to market and your buyer. Compare real offers and ask your local cooperative about current collection and auction dates.': 'Theko eo o e fumanang e ka itshetleha ka boleng, maemo, sehla, bohole ba mmaraka le moreki. Bapisa ditlhahiso tsa nnete mme o botse koporasi ya lehae ka matsatsi a hona jwale a pokello le fantisi.',
  'Ask your cooperative': 'Botsa koporasi ya hao',
  'Your cooperative can share verified local buyer and sale information.': 'Koporasi ya hao e ka arolelana dintlha tsa nnete tsa bareki le thekiso ya lehae.',
  'A HELPFUL HEADS-UP': 'TSEBISO E THUSANG',
  'Preference saved.': 'Kgetho e bolokilwe.',
  'Hear when prices change.': 'Tsebiswa ha ditheko di fetoha.',
  'Save your preference to your account. Alerts will be delivered once a verified market feed and notification service are connected.': 'Boloka kgetho ya hao akhaontong. Ditemoso di tla romelwa ha data ya nnete ya mmaraka le tshebeletso ya ditsebiso di hokahanngwa.',
  'Alerts preference on': 'Ditemoso di butswe',
  'Save preference': 'Boloka kgetho',
  'Sign in to save': 'Kena ho boloka',
  'Market alert preference saved. Delivery will be enabled when a verified price feed is connected.': 'Kgetho ya ditemoso tsa mmaraka e bolokilwe. Di tla romelwa ha data ya nnete ya ditheko e hokahanngwa.',
  'Market alerts turned off.': 'Ditemoso tsa mmaraka di kwetswe.',
  'YOUR LOCAL NETWORK': 'MARANGRANG A HAO A LEHAE',
  'Growing stronger,': 'Ho matlafala,',
  'side by side.': 're bapile.',
  'Small farms can make a big impact. Pooling your produce means more choices, more negotiating power, and a stronger community.': 'Mapolasi a manyane a ka tlisa phetoho e kgolo. Ho kopanya dihlahiswa ho fana ka dikgetho tse ngata le matla a ho buisana, mme ho matlafatsa setjhaba.',
  'Become a member': 'Eba setho',
  'registered members': 'ditho tse ngodisitsweng',
  'produce lots listed': 'dihlahiswa tse thathamisitsweng',
  'active groups · data not connected': 'dihlopha tse sebetsang · data ha e a hokahanngwa',
  'completed sales · data not connected': 'thekiso e phethilweng · data ha e a hokahanngwa',
  'Members': 'Ditho',
  Produce: 'Dihlahiswa',
  Announcements: 'Ditsebiso',
  Opportunities: 'Menyetla',
  'AVAILABLE PRODUCE': 'DIHLAHISWA TSE FUMANEHANG',
  'Active this week': 'O ne a le teng bekeng ena',
  'Open to marketing': 'O ikemiseditse ho rekisa',
  'Find a farmer…': 'Batla rapolasi…',
  'Listings are demonstration records stored on this device. Contact farmers through your cooperative to confirm availability before making plans.': 'Manane ke mehlala e bolokilweng sesebedisweng sena. Ikopanye le barapolasi ka koporasi ya hao ho netefatsa hore dihlahiswa di teng.',
  'Share vegetables with the group.': 'Arolelana meroho le sehlopha.',
  'EXAMPLE LISTING': 'LENANE LA MOHLALA',
  'FROM YOUR CO-OP ADMINISTRATORS': 'HO TSWA HO BATSAMAISI BA KOPORASI',
  'Community noticeboard': 'Letlapa la ditsebiso tsa setjhaba',
  'Seedling exchange': 'Phapanyetsano ya dimela tse nyane',
  'Example opportunity · ask your cooperative to confirm dates': 'Monyetla wa mohlala · botsa koporasi ho netefatsa matsatsi',
  'Growers meeting': 'Kopano ya balemi',
  'This is a demonstration opportunity. Ask your local cooperative to confirm current dates and availability.': 'Ona ke monyetla wa pontsho. Botsa koporasi ya lehae ho netefatsa matsatsi le boteng ba hona jwale.',
  'Ask about this': 'Botsa ka sena',
  'SHARE TO GROW': 'AROLELANA HO HOLA',
  'Borrow & share equipment': 'Adimana le ho arolelana disebediswa',
  'Connect with neighbours to make tools and transport go further.': 'Hokahana le baahisani ho sebedisa disebediswa le dipalangwang ka katleho.',
  'Ox-drawn plough': 'Mohoma o huloang ke dikgomo',
  'Available to borrow': 'E teng bakeng sa ho adingwa',
  'Example listing · Berea': 'Lenane la mohlala · Berea',
  'Farm trailer': 'K\'haravene ya polasi',
  'Available to share': 'E teng bakeng sa ho arolelanwa',
  'Example listing · Maseru': 'Lenane la mohlala · Maseru',
  'Water tank': 'Tanka ya metsi',
  'Looking to borrow': 'E batlwa bakeng sa ho adingwa',
  'Example listing · Leribe': 'Lenane la mohlala · Leribe',
  'View details': 'Sheba dintlha',
  'This is a sample listing. No booking or message was sent; contact your cooperative to arrange equipment sharing.': 'Lena ke lenane la mohlala. Ha ho kopo kapa molaetsa o rometsweng; ikopanye le koporasi ya hao ho rera tshebediso ya disebediswa.',
  'Demonstration listings only · availability and contact details are not connected.': 'Manane ke mehlala feela · boteng le dintlha tsa puisano ha di a hokahanngwa.',
  'SEASONAL CROP GUIDE · LESOTHO': 'TATAISO YA DIJALO TSA SEHLA · LESOTHO',
  'What to grow, and when': 'O jale eng, hona neng',
  'A practical planning calendar for the current month:': 'Lenane la moralo wa kgwedi ena:',
  'Rainy season': 'Sehla sa dipula',
  'Cooler, drier season': 'Sehla se phodileng le se ommeng',
  SOW: 'JALA',
  HARVEST: 'KOTULO',
  'Check soil moisture and plant after dependable early rains.': 'Hlahloba mongobo wa mobu mme o leme ha dipula tsa pele di tshepahala.',
  'Prepare seed and storage for the next planting window.': 'Lokisa peo le polokelo bakeng sa nako e latelang ya ho jala.',
  'Use clean seed and avoid waterlogged ground.': 'Sebelisa peo e hlwekileng mme o qobe mobu o tletseng metsi.',
  'Earth up plants as they grow and protect from frost.': 'Bokella mobu ho potoloha dimela ha di hola mme o di sireletse serameng.',
  'Choose a cool-season planting window and water consistently.': 'Kgetha nako e phodileng ya ho lema mme o nosetse ka mehla.',
  'General seasonal guidance only. Timing varies by altitude, district, local weather and variety; ask your local extension officer before planting.': 'Tataiso ena ke ya sehla feela. Nako e fapana ho ya ka bophahamo, setereke, lehodimo le mofuta wa sejalo; botsa ofisiri ya temo ya lehae pele o lema.',
  'THIS SEASON’S PICK': 'KGETHO YA SEHLA SENA',
  'Plant with the rain,': 'Jala le dipula,',
  'not against it.': 'eseng kgahlanong le tsona.',
  'A few small changes to how you plan and water can make a real difference to your next harvest.': 'Diphetoho tse nyane morerong le nosetsong di ka ntlafatsa kotulo e tlang.',
  'THE COMMUNITY KNOW-HOW LIBRARY': 'POLOKELLO YA TSEBO YA SETJHABA',
  'Have a tip that works on your farm?': 'O na le keletso e sebetsang polasing ya hao?',
  'Great local knowledge deserves to be shared. Talk to your cooperative about contributing.': 'Tsebo e ntle ya lehae e lokela ho arolelanwa. Bua le koporasi ya hao ka ho kenya letsoho.',
  'Get involved': 'Kenya letsoho',
  'A first-time grower’s guide to spinach': 'Tataiso ya ba qalang ho lema sepinichi',
  'Plan your vegetable garden around rainfall patterns and make every drop count.': 'Rera serapa sa meroho ho ya ka dipula mme o sebedise lerothodi le leng le le leng.',
  'Choosing a bed, getting started with seed, and keeping your greens thriving.': 'Ho kgetha sebaka, ho qala ka peo le ho hodisa meroho hantle.',
  'Healthy soil, stronger harvests': 'Mobu o phetseng hantle, kotulo e ngata',
  'Low-cost ways to protect your soil, improve fertility and cut down on waste.': 'Ditsela tse theko e tlase tsa ho sireletsa mobu, ho ntlafatsa monono le ho fokotsa tshenyo.',
  'Selling together: a simple starting guide': 'Ho rekisa mmoho: tataiso e bonolo ya ho qala',
  'Bring your produce together, agree on a quality standard and find more buyers.': 'Kopanyang dihlahiswa, dumellanang ka boleng mme le fumane bareki ba bangata.',
  'Save resource': 'Boloka tataiso',
  'Remove saved resource': 'Tlosa tataiso e bolokilweng',
  Saved: 'E bolokilwe',
  'Administrator account': 'Akhaonto ya motsamaisi',
  'Protected admin actions are recorded on the server.': 'Diketso tsa motsamaisi di bolokwa ho seva.',
  'Refresh accounts': 'Ntjhafatsa diakhaonto',
  'Registered farmers': 'Barapolasi ba ngodisitsweng',
  'Community accounts': 'Diakhaonto tsa setjhaba',
  'Co-op administrators': 'Batsamaisi ba koporasi',
  'Protected accounts': 'Diakhaonto tse sireleditsweng',
  'Total members': 'Palo yohle ya ditho',
  'All account roles': 'Maemo ohle a diakhaonto',
  Suspended: 'E emisitswe',
  'Accounts with access paused': 'Diakhaonto tse emisitsweng nakwana',
  'REGISTERED AGRIVISION ACCOUNTS': 'DIAKHAONTO TSA AGRIVISION TSE NGODISITSWENG',
  'New announcement': 'Tsebiso e ntjha',
  'Loading accounts…': 'Ho jarollwa diakhaonto…',
  EMAIL: 'IMEILE',
  FARM: 'POLASI',
  DISTRICT: 'SETereke',
  ROLE: 'KAROLO',
  ACCESS: 'PHIHLELLO',
  ACTION: 'KETSO',
  Active: 'E sebetsa',
  Restore: 'Kgutlisa',
  Suspend: 'Emisa',
  'No accounts yet': 'Ha ho diakhaonto',
  'Role-based access': 'Phihlello e itshetlehileng ka karolo',
  'Farmers can manage their own animal records and produce listings. Administrators can publish announcements and suspend farmer accounts. Passwords are never shown to administrators.': 'Barapolasi ba ka laola direkoto tsa bona le manane a dihlahiswa. Batsamaisi ba ka phatlalatsa ditsebiso le ho emisa diakhaonto. Diphasewete ha di bontshwe batsamaisi.',
  'Cooperative administrator': 'Motsamaisi wa koporasi',
  'YOUR NAME': 'LEBITSO LA HAO',
  'FARM NAME': 'LEBITSO LA POLASI',
  'PHONE NUMBER': 'NOMORO YA MOHALA',
  OPTIONAL: 'HA E TLAMEHE',
  'Details are stored in your AgriVision account.': 'Dintlha di bolokwa akhaontong ya hao ya AgriVision.',
  'Secure administrator account': 'Akhaonto ya motsamaisi e sireletsehileng',
  'Secure farmer account': 'Akhaonto ya rapolasi e sireletsehileng',
  'Your password is one-way hashed. This session uses a secure, HTTP-only cookie and expires after 8 hours.': 'Phasewete ya hao e sireleditswe ka tsela e ke keng ya kgutlisetswa morao. Nako ena e sebedisa cookie e sireletsehileng mme e fela kamora dihora tse 8.',
  'Your data belongs to you.': 'Dintlha tsa hao ke tsa hao.',
  'Farm records are stored in your AgriVision account database. Notification display preferences and saved learning guides stay in this browser.': 'Direkoto tsa polasi di bolokwa akhaontong ya hao ya AgriVision. Dikgetho tsa ditsebiso le ditaelo tse bolokilweng di sala ho sebatli sena.',
  'Clear local preferences': 'Hlakola dikgetho tsa sesebediswa sena',
  'Clear saved preferences and guide bookmarks from this browser? Your account and farm records will not be deleted.': 'Hlakola dikgetho le ditaelo tse bolokilweng sebatling see? Akhaonto le direkoto tsa polasi di ke ke tsa hlakolwa.',
  'Your preferences are saved.': 'Dikgetho tsa hao di bolokilwe.',
  'Choose what you hear about.': 'Kgetha ditsebiso tseo o batlang ho di fumana.',
  'YOUR NOTIFICATIONS': 'DITSEBISO TSA HAO',
  'Weather reminders': 'Dikgopotso tsa lehodimo',
  'A heads-up about the forecast in your district': 'Tsebiso ka ponelopele ya setereke sa hao',
  'Market price changes': 'Diphetoho tsa ditheko tsa mmaraka',
  'Know when local prices shift': 'Tseba ha ditheko tsa lehae di fetoha',
  'Cooperative updates': 'Ditaba tsa koporasi',
  'Meetings, opportunities and announcements': 'Dikopano, menyetla le ditsebiso',
  'Email updates': 'Ditaba ka imeile',
  'An occasional note to your inbox': 'Molaetsa wa nako le nako ho imeile ya hao',
  'Free weather, rain alerts, crop prices and farming advice for everyone. Create a free farmer account to share produce and join the cooperative.': 'Boemo ba lehodimo, ditemoso tsa pula, ditheko tsa dijalo le dikeletso tsa temo ke mahala. Iketsetse akhaonto ya rapolasi ho arolelana dihlahiswa le ho ikopanya le koporasi.',
  'Checking…': 'E a hlahlojwa…',
  'Heavy rain, hail, frost and dry-spell warnings from the live forecast.': 'Ditemoso tsa pula e matla, sefako, serame le komello tse tswang ponelopele ya hona jwale.',
  'How to protect your farm →': 'Mokgwa wa ho sireletsa polasi ya hao →',
  'Crops and prices': 'Dijalo le ditheko',
  'Prices coming soon': 'Ditheko di tla tla haufinyane',
  'Prices researched by our administrator, with photos of every crop.': 'Ditheko di batlisiswa ke motsamaisi wa rona, ka ditshwantsho tsa sejalo ka seng.',
  'Browse crops →': 'Sheba dijalo →',
  'FARMING RESOURCES': 'TSEBO YA TEMO',
  'Practical farming guides': 'Ditaelo tse sebetsang tsa temo',
  'Find ideas for planting, soil care and growing vegetables.': 'Fumana mehopolo ya ho jala, ho hlokomela mobu le ho lema meroho.',
  'See guides →': 'Sheba ditaelo →',
  'With a free account you can': 'Ka akhaonto ya mahala o ka',
  'Join the cooperative and read its announcements.': 'Ikopanya le koporasi mme o bale ditsebiso tsa yona.',
  'List your produce for other farmers and buyers.': 'Thathamisa dihlahiswa tsa hao bakeng sa barapolasi le bareki ba bang.',
  'Sign in or create an account': 'Kena kapa o iketsetse akhaonto',
  'How to protect your farm': 'Mokgwa wa ho sireletsa polasi ya hao',
  'These alerts come from a forecast and simple rain, wind and temperature limits. They are a guide, not an official warning. Also follow Lesotho Meteorological Services.': 'Ditemoso tsena di tswa ponelopele le meedi ya pula, moya le themphereitjhara. Ke tataiso, eseng temoso ya semmuso. Latela le Lesotho Meteorological Services.',
  'See what to do': 'Sheba seo o ka se etsang',
  'Made for the people who grow Lesotho': 'E etseditswe batho ba lemang Lesotho',
  'Helping our communities thrive': 'Ho thusa ditjhaba tsa rona ho atleha',
  'Demo only · no orders or payments are processed.': 'Pontsho feela · ha ho diotara kapa ditefo tse sebetswang.',
  'Thunderstorm with hail possible.': 'Leduma le sefako di ka ba teng.',
  'Rooted in community.': 'Metso ya setjhaba.',
  'Growing for tomorrow.': 'Ho hola bakeng sa hosane.',
  'Main navigation': 'Menu ya mantlha',
  'Southern Africa': 'Afrika Borwa',
  'Weather recommendations': 'Dikeletso tsa lehodimo',
  'LIVE DISTRICT FORECAST': 'PONOELEPELE YA SETEREKE HONA JWALE',
  'LIVE FORECAST · OPEN-METEO': 'PONOELEPELE YA HONA JWALE · OPEN-METEO',
  'See all market prices': 'Sheba ditheko tsohle tsa mmaraka',
  'Explore cooperative': 'Sheba koporasi',
  'Forecast recommendations': 'Dikeletso tsa ponelopele',
  'LIVE DATA REQUIRED': 'HO HLOKAHALA DATA YA HONA JWALE',
  'LIVE FORECAST': 'PONOELEPELE YA HONA JWALE',
  'Make the most of the dry days.': 'Sebelisa matsatsi a ommeng ka katleho.',
  'Live forecast guidance will appear when weather data is available.': 'Tataiso ya ponelopele e tla hlaha ha data ya lehodimo e fumaneha.',
  'General guidance · use your local knowledge': 'Tataiso e akaretsang · sebedisa tsebo ya lehae.',
  'Open-Meteo forecast data is not an official severe-weather warning service. Follow Lesotho’s meteorological authorities for warnings.': 'Dintlha tsa ponelopele ya Open-Meteo ha se tshebeletso ya semmuso ya ditemoso tsa maemo a mabe a lehodimo. Latela balaodi ba lehodimo ba Lesotho bakeng sa ditemoso.',
  'Forecast source: Open-Meteo · automatically refreshed by district.': 'Mohlodi wa ponelopele: Open-Meteo · e ntjhafatswa ka setereke.',
  'Live forecasts are supplied by Open-Meteo. Availability and accuracy vary; this is not an official weather alert service.': 'Diponelopele tsa hona jwale di fanwa ke Open-Meteo. Boteng le ho nepahala di a fapana; sena ha se tshebeletso ya semmuso ya ditemoso tsa lehodimo.',
  'RAIN ALERTS & PROTECTION': 'DITEMOSO TSA PULA LE TSHIRELETSO',
  'Checking the forecast': 'Ho hlahlojwa ponelopele',
  'No weather alerts': 'Ha ho ditemoso tsa lehodimo',
  'Nothing serious is forecast in the next 7 days. Check again each morning.': 'Ha ho boemo bo kotsi bo bonwang matsatsing a 7 a tlang. Sheba hape hoseng ho hong le ho hong.',
  'Alert now': 'Temoso hona jwale',
  'General guidance. Please confirm details with a local agriculture or extension officer.': 'Tataiso e akaretsang. Netefatsa dintlha ho ofisiri ya temo kapa ya katoloso ya lehae.',
  'Your account and cooperative details are available to registered farmers and administrators.': 'Dintlha tsa akhaonto ya hao le koporasi di fumaneha ho barapolasi le batsamaisi ba ngodisitsweng.',
  'No stories yet.': 'Ha ho dipale hona jwale.',
  'Please check back soon.': 'Ka kopo, kgutla hape haufinyane.',
  'Use “Add a story” to publish the first one.': 'Sebelisa “Kenya pale” ho phatlalatsa pale ya pele.',
  'Everything': 'Tsohle',
  'CLIMATE SMART': 'TSEBO YA LEHODIMO',
  'VEGETABLES': 'MEROHO',
  'SUSTAINABILITY': 'TSEBO YA TEMO E TSWARELLANG',
  'COOPERATIVES': 'DIKOPORASI',
  'Planting with the changing seasons': 'Ho jala ho ya ka diphetoho tsa dihla',
  'Open': 'E butswe',
  'Frost': 'Serame',
  'Hail and strong wind': 'Sefako le moya o matla',
  'Dry spells and drought': 'Nako tse ommeng le komello',
  'Soil erosion on slopes': 'Khoholeho ya mobu matsoapong',
  'Too much water at once washes away seed and soil, and drowns roots.': 'Metsi a mangata ka nako e le nngwe a hohola peo le mobu, mme a kgama metso.',
  'Dig a drainage trench along the uphill edge of the field.': 'Epa foro ya metsi lehlakoreng le ka hodimo la tshimo.',
  'A ditch about 30 cm deep above your crops sends runoff around them instead of through them.': 'Foro e ka bang botebo ba 30 cm ka hodima dijalo e tsamaisa metsi ka thoko ho tsona.',
  'Plant on raised beds or ridges so roots stay above standing water.': 'Jala dibetheng tse phahamisitsweng hore metso e se ke ya ema metsing.',
  'Cabbages planted on ridges about 20 cm high, with water running off in the furrows between.': 'Khabeche e jetsweng mekotleng e ka bang 20 cm ka hodimo, metsi a phalle dikotjaneng tse pakeng tsa yona.',
  'Harvest ripe produce early and keep stored grain covered and off the floor.': 'Kotula dihlahiswa tse butswitseng pele mme o boloke mabele a kwahetswe a sa be fatshe.',
  'Cut mature vegetables before the storm, and stack grain bags on pallets or stones under a roof.': 'Kgaola meroho e butswitseng pele ho sefefo, mme o bee mekotla ya mabele hodima dipalete kapa majwe tlasa marulelo.',
  'Hail shreds leaves and fruit in minutes. Wind can flatten tall crops.': 'Sefako se senya makgasi le ditholwana ka metsotso. Moya o ka robatsa dijalo tse telele.',
  'Cover high-value vegetables with hail net or shade cloth.': 'Kwahela meroho ya boleng bo hodimo ka letlowa la sefako kapa lesela la moriti.',
  'A net held on poles over tomato rows protects the plants and lets light and rain through.': 'Letlowa le beilweng hodima dipalo ka hodima mela ya tamati le sireletsa dimela empa le dumella kganya le pula.',
  'Stake tall crops such as tomatoes, and earth up maize.': 'Tlamella dijalo tse telele tse kang tamati, mme o bokelle mobu pooneng.',
  'Tie each tomato plant to a stake with soft string, loosely enough that the stem can grow.': 'Tlama semela ka seng sa tamati palong ka kgwele e bonolo, o se ke wa tiisa hore kutu e hole.',
  'Plant a windbreak of trees or tall grass along the exposed edge.': 'Jala difate kapa jwang bo bolelele ho thibela moya lehlakoreng le bulehileng.',
  'A row of trees on the windy side slows the wind across the whole field.': 'Mola wa difate lehlakoreng le nang le moya o fokotsa moya tshimong yohle.',
  'Frost can kill seedlings and flowers overnight, especially in the highlands.': 'Serame se ka bolaya dimela tse nyane le dipalesa bosiu, haholoholo dithabeng.',
  'Cover seedlings in the evening and take the cover off in the morning.': 'Kwahela dimela tse nyane mantsiboya mme o di hlobolise hoseng.',
  'Old sacks, plastic sheets or straw over bean seedlings, lifted off on sticks so they do not touch the leaves.': 'Mekotla ya kgale, dipolasetiki kapa jwang hodima dimela tse nyane tsa dinawa, di phahamisitswe ka dithupa hore di se ame makgasi.',
  'Water the soil in the afternoon before a frost night.': 'Nosetsa mobu thapama pele ho bosiu ba serame.',
  'Moist soil holds more heat than dry soil, so the air near the plants stays slightly warmer.': 'Mobu o mongobo o boloka mocheso ho feta o ommeng, kahoo moya pela dimela o dula o futhumetse hanyenyane.',
  'Delay planting tender crops until the last frost has passed.': 'Emela serame sa ho qetela se fete pele o jala dijalo tse sa mamelleng serame.',
  'Start tomatoes and beans late in spring, and use frost-hardy crops such as cabbage or spinach early.': 'Jala tamati le dinawa nakong e qetellang ya selemo, mme o jale khabeche kapa sepinichi se mamellang serame pele.',
  'Without rain, young crops wilt and yields fall.': 'Ha pula e le siyo, dijalo tse nyane di a pona mme kotulo e a fokotseha.',
  'Mulch around plants to keep moisture in the soil.': 'Ala jwang kapa makgasi a ommeng ho potoloha dimela ho boloka mongobo mobung.',
  'A thick layer of dry grass or straw around each plant slows evaporation and keeps weeds down.': 'Lera le letenya la jwang bo ommeng ho potoloha semela ka seng le fokotsa mouoane mme le thibela lehola.',
  'Dig planting basins (likoti) that catch rain right at the plant.': 'Epa dikoti tsa ho jala tse bokellang pula pela semela.',
  'Small pits, spaced along the row, collect water and let it sink in beside the roots.': 'Dikoti tse nyane moleng di bokella metsi mme di a isa pela metso.',
  'Choose drought-tolerant crops and plant at the start of the rains.': 'Kgetha dijalo tse mamellang komello mme o di jale qalong ya dipula.',
  'Sorghum and some beans cope with dry weather better than maize on poor soil.': 'Mabele le mefuta e meng ya dinawa di mamella komello ho feta poone mobung o futsanehileng.',
  'Heavy rain on bare slopes carries away the best topsoil.': 'Pula e matla matsoapong a se nang dimela e hohola mobu o nonneng o ka hodimo.',
  'Plough and plant along the contour, and build stone terraces on steep land.': 'Lema o latela mela ya bophara ba thaba, mme o hahe mabota a majwe mobung o moepa.',
  'Rows that follow the slope across, not up and down, with stone or grass strips every few metres to slow the water.': 'Jala ka mela e tshekaletseng thaba, eseng e nyolohang kapa e theohang, o kenye majwe kapa jwang ho fokotsa metsi.',
  'Keep the soil covered with crops, residue or mulch.': 'Kwahela mobu ka dijalo, masalla a dimela kapa jwang.',
  'Leave maize stalks on the field after harvest instead of burning them.': 'Tlohela mahlaka a poone tshimong kamora kotulo ho e na le ho a tjhesa.',
  'Example:': 'Mohlala:',
  '5 min read': 'Metsotso e 5 ya ho bala',
  '6 min read': 'Metsotso e 6 ya ho bala',
  '7 min read': 'Metsotso e 7 ya ho bala',
  '9 min read': 'Metsotso e 9 ya ho bala',
  'in': 'ho',
  January: 'Pherekgong',
  February: 'Hlakola',
  March: 'Tlhakubele',
  April: 'Mmesa',
  May: 'Motsheanong',
  June: 'Phupjane',
  July: 'Phupu',
  August: 'Phato',
  September: 'Lwetse',
  October: 'Mphalane',
  November: 'Pudungwana',
  December: 'Tshitwe',
  'Oct – Dec': 'Mphalane – Tshitwe',
  'Nov – Jan': 'Pudungwana – Pherekgong',
  'Feb – Apr': 'Hlakola – Mmesa',
  'Sep – Feb': 'Lwetse – Hlakola',
  'Dec – May': 'Tshitwe – Motsheanong',
  'Feb – May': 'Hlakola – Motsheanong',
  'May – Sep': 'Motsheanong – Lwetse',
  'Mar – May': 'Tlhakubele – Motsheanong',
  'LESOTHO · FARMER NETWORK': 'LESOTHO · MARANGRANG A BARAPOLASI',
  Beans: 'Dinawa',
  'Plan around likely rainfall.': 'Rera o ela hloko pula e ka nang.',
  'The forecast for': 'Ponelopele ya',
  'shows a lower chance of rain today. It may be a useful window for outdoor work; check local conditions before starting.': 'e bontsha monyetla o tlase wa pula kajeno. E ka ba nako e loketseng ya mosebetsi wa kantle; hlahloba maemo a lehae pele o qala.',
  'chance of rain today. Consider protecting stored crops and allowing extra drying time.': 'monyetla wa pula kajeno. Nahana ka ho sireletsa dijalo tse bolokilweng le ho di dumella ho oma nako e eketsehileng.',
  '1 item': 'ntho e 1',
  '2 kg bag': 'mokotla wa 2 kg',
  Tomatoes: 'Ditamati',
  Jan: 'Pherekgong',
  Feb: 'Hlakola',
  Mar: 'Tlhakubele',
  Apr: 'Mmesa',
  Jun: 'Phupjane',
  Jul: 'Phupu',
  Aug: 'Phato',
  Sep: 'Lwetse',
  Oct: 'Mphalane',
  Nov: 'Pudungwana',
  Mon: 'Mantaha',
  Tue: 'Labobeli',
  Wed: 'Laboraro',
  Thu: 'Labone',
  Fri: 'Labohlano',
  Sat: 'Moqebelo',
  Sun: 'Sontaha',
  Monday: 'Mantaha',
  Tuesday: 'Labobeli',
  Wednesday: 'Laboraro',
  Thursday: 'Labone',
  Friday: 'Labohlano',
  Saturday: 'Moqebelo',
  Sunday: 'Sontaha',
}

function useTranslate() {
  const language = useContext(LocaleContext)
  return (text) => translateText(text, language)
}

function TranslateContent({ children }) {
  const t = useTranslate()
  const translateNode = (node) => {
    if (typeof node === 'string') {
      const leading = node.match(/^\s*/)[0]
      const trailing = node.match(/\s*$/)[0]
      const text = node.slice(leading.length, node.length - trailing.length || undefined)
      return text ? `${leading}${t(text)}${trailing}` : node
    }
    if (Array.isArray(node)) return Children.toArray(node).map(translateNode)
    if (!isValidElement(node)) return node
    const props = { ...node.props }
    if (Object.prototype.hasOwnProperty.call(props, 'children')) props.children = translateNode(props.children)
    for (const name of ['alt', 'aria-label', 'placeholder', 'title']) {
      if (typeof props[name] === 'string') props[name] = t(props[name])
    }
    return cloneElement(node, props)
  }
  return <>{translateNode(children)}</>
}

function translateText(text, language) {
  if (language !== 'st') return text
  const translation = sesothoText[text]
  if (translation) return translation

  const passwordLength = text.match(/^Use at least 12 characters \(you have (\d+)\)\.$/)
  if (passwordLength) return `Sebedisa bonyane ditlhaku tse 12 (o kentse ${passwordLength[1]}).`

  const daysInDistrict = text.match(/^(\d+ days) in (.+)$/)
  if (daysInDistrict) return `${sesothoText[daysInDistrict[1]]} ho ${daysInDistrict[2]}`

  const checkingForecast = text.match(/^Checking the forecast for (.+)…$/)
  if (checkingForecast) return `Ho hlahlojwa ponelopele ya ${checkingForecast[1]}…`

  const noWeatherAlerts = text.match(/^No weather alerts for (.+)$/)
  if (noWeatherAlerts) return `Ha ho ditemoso tsa lehodimo ho ${noWeatherAlerts[1]}`

  const alertCount = text.match(/^(\d+) alerts? for (.+)$/)
  if (alertCount) return `${alertCount[1]} ${alertCount[1] === '1' ? 'temoso' : 'ditemoso'} bakeng sa ${alertCount[2]}`

  const noAlerts = text.match(/^No alerts for (.+)$/)
  if (noAlerts) return `Ha ho ditemoso bakeng sa ${noAlerts[1]}`

  const noReading = text.match(/^No live reading for (.+)\.$/)
  if (noReading) return `Ha ho tekanyo ya hona jwale bakeng sa ${noReading[1]}.`

  const districtRain = text.match(/^The forecast for (.+) shows a (\d+)% chance of rain today\. Consider protecting stored crops and allowing extra drying time\.$/)
  if (districtRain) return `Ponelopele ya ${districtRain[1]} e bontsha monyetla wa pula wa ${districtRain[2]}% kajeno. Sireletsa dijalo tse bolokilweng mme o di fe nako e eketsehileng ya ho oma.`

  const districtDry = text.match(/^The forecast for (.+) shows a lower chance of rain today\. It may be a useful window for outdoor work; check local conditions before starting\.$/)
  if (districtDry) return `Ponelopele ya ${districtDry[1]} e bontsha monyetla o tlase wa pula kajeno. E ka ba nako e loketseng ya mosebetsi wa kantle; hlahloba maemo a lehae pele o qala.`

  const rainProbability = text.match(/^(\d+)% chance of rain today in (.+)\. Use local conditions to plan outdoor work\.$/)
  if (rainProbability) return `Monyetla wa pula wa ${rainProbability[1]}% kajeno ho ${rainProbability[2]}. Sebedisa maemo a lehae ho rera mosebetsi wa kantle.`

  const weatherError = text.match(/^Live weather could not be loaded: (.+)\.$/)
  if (weatherError) return `Boemo ba lehodimo ha boa kgona ho jarollwa: ${weatherError[1]}.`

  const forecastError = text.match(/^Live forecast could not be loaded: (.+)$/)
  if (forecastError) return `Ponelopele ya hona jwale ha e a kgona ho jarollwa: ${forecastError[1]}`

  const dynamicAlert = text.match(/^(Very heavy rain likely|Heavy rain possible): about (\d+) mm\.$/)
  if (dynamicAlert) return `${dynamicAlert[1] === 'Very heavy rain likely' ? 'Pula e matla haholo e ka na' : 'Pula e matla e ka nna ya na'}: hoo e ka bang ${dynamicAlert[2]} mm.`

  const windAlert = text.match(/^Strong wind gusts up to (\d+) km\/h\.$/)
  if (windAlert) return `Moya o matla wa ho fihla ${windAlert[1]} km/h.`

  const frostAlert = text.match(/^(Frost likely|Frost possible): low of (\d+)°C\.$/)
  if (frostAlert) return `${frostAlert[1] === 'Frost likely' ? 'Serame se ka ba teng' : 'Serame se ka nna sa ba teng'}: themphereitjhara e tlase ya ${frostAlert[2]}°C.`

  return text
}

const navGroups = [
  { label: 'YOUR FARM', links: [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/weather', label: 'Weather', icon: CloudSun },
    { to: '/crops', label: 'Crop prices', icon: TrendingUp },
    { to: '/markets', label: 'Market prices', icon: BarChart3 },
    { to: '/alerts', label: 'Alerts & protection', icon: CloudRain },
  ] },
  { label: 'YOUR COMMUNITY', links: [
    { to: '/marketplace', label: 'Fresh produce', icon: ShoppingBag },
    { to: '/cooperative', label: 'Cooperative', icon: Users },
    { to: '/stories', label: 'Success stories', icon: Sparkles },
    { to: '/resources', label: 'Farming resources', icon: BookOpen },
  ] },
  { label: 'ACCOUNT', links: [
    { to: '/profile', label: 'My profile', icon: UserRound },
    { to: '/settings', label: 'Settings', icon: Settings },
  ] },
]
const resources = [
  { category: 'CLIMATE SMART', title: 'Planting with the changing seasons', detail: 'Plan your vegetable garden around rainfall patterns and make every drop count.', time: '5 min read', image: 'photo-1551754655-cd27e38d2076', color: 'green' },
  { category: 'VEGETABLES', title: 'A first-time grower’s guide to spinach', detail: 'Choosing a bed, getting started with seed, and keeping your greens thriving.', time: '7 min read', image: 'photo-1576045057995-568f588f82fb', color: 'green' },
  { category: 'SUSTAINABILITY', title: 'Healthy soil, stronger harvests', detail: 'Low-cost ways to protect your soil, improve fertility and cut down on waste.', time: '9 min read', image: 'photo-1518977676601-b53f82aba655', color: 'green' },
  { category: 'COOPERATIVES', title: 'Selling together: a simple starting guide', detail: 'Bring your produce together, agree on a quality standard and find more buyers.', time: '6 min read', image: 'photo-1546094096-0df4bcaaa337', color: 'green' },
]

function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(`agriconnect-${key}`)
      return saved ? JSON.parse(saved) : initial
    } catch (error) {
      console.error(`Unable to load ${key} from local storage.`, error)
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(`agriconnect-${key}`, JSON.stringify(value))
    } catch (error) {
      console.error(`Unable to save ${key} to local storage.`, error)
    }
  }, [key, value])
  return [value, setValue]
}

function App() {
  const [members, setMembers] = useState([])
  const [activities, setActivities] = useState([])
  const [products, setProducts] = useState([])
  const [session, setSession] = useState(null)
  const [authStatus, setAuthStatus] = useState('checking')
  const [backendStatus, setBackendStatus] = useState(null)
  const [profile, setProfile] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [modal, setModal] = useState('')
  const [authAudience, setAuthAudience] = useState('farmer')
  const [basket, setBasket] = useStoredState('basket', [])
  const [language, setLanguage] = useStoredState('language', 'en')
  const translate = (text) => translateText(text, language)
  const today = new Date()
  const todayLabel = language === 'st'
    ? `${translate(today.toLocaleDateString('en', { weekday: 'short' }))}, ${today.toLocaleDateString('en', { day: 'numeric' })} ${translate(today.toLocaleDateString('en', { month: 'short' }))}`
    : today.toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'short' })
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])
  useEffect(() => {
    let active = true
    Promise.allSettled([apiRequest('/api/health'), apiRequest('/api/auth/me')]).then(([health, auth]) => {
      if (!active) return
      if (health.status === 'fulfilled') setBackendStatus(health.value)
      else setBackendStatus({ status: 'unavailable', error: health.reason.message })
      if (auth.status === 'fulfilled') {
        setSession(auth.value.user)
        setAuthStatus(auth.value.user ? 'authenticated' : 'anonymous')
      } else {
        setAuthStatus('anonymous')
      }
    })
    return () => { active = false }
  }, [])
  useEffect(() => { setMobileOpen(false) }, [location.pathname])
  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 3500)
    return () => window.clearTimeout(timer)
  }, [notice])
  const refreshFarmData = async () => {
    const [memberData, productData, announcementData, profileData] = await Promise.all([
      apiRequest('/api/cooperative/members'),
      apiRequest('/api/cooperative/produce'),
      apiRequest('/api/cooperative/announcements'),
      apiRequest('/api/profile'),
    ])
    setMembers(memberData.members.map((member) => ({ ...member, initials: member.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(), product: 'Cooperative member', color: 'sage' })))
    setProducts(productData.products)
    setActivities(announcementData.announcements.map((item) => ({ ...item, time: new Date(item.createdAt || Date.now()).toLocaleDateString(), icon: 'users', color: 'green' })))
    setProfile({ ...profileData.profile, phone: profileData.profile.phone || '' })
  }
  useEffect(() => {
    if (authStatus !== 'authenticated') return undefined
    let active = true
    refreshFarmData().catch((error) => { if (active) setNotice(`Could not load your farm data: ${error.message}`) })
    return () => { active = false }
  }, [authStatus, session?.id])
  const addMember = async () => {
    await apiRequest('/api/cooperative/members', { method: 'POST', body: {} })
    await refreshFarmData()
    setModal('')
    setNotice('Your cooperative membership is active')
  }
  const addActivity = async (activity) => {
    const result = await apiRequest('/api/cooperative/announcements', { method: 'POST', body: activity })
    setActivities((current) => [{ ...result.announcement, icon: 'users', color: 'green', time: 'Just now' }, ...current])
    setModal('')
    setNotice('Cooperative announcement published')
  }
  const addProduct = async (product) => {
    const result = await apiRequest('/api/cooperative/produce', { method: 'POST', body: product })
    setProducts((current) => [result.product, ...current])
    setModal('')
    setNotice('Produce listing saved to your cooperative')
  }
  const updateProfile = async (next) => {
    const result = await apiRequest('/api/profile', { method: 'PATCH', body: next })
    setProfile(result.profile)
    setSession((current) => ({ ...current, ...result.profile }))
    setNotice('Your profile has been updated')
  }
  const updateSession = (user) => {
    setSession(user)
    setAuthStatus('authenticated')
    setModal('')
    setNotice(`Signed in as ${user.role === 'admin' ? 'cooperative administrator' : 'farmer'}`)
  }
  const signOut = async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST', body: {} })
      setSession(null)
      setAuthStatus('anonymous')
      setMembers([])
      setProducts([])
      setActivities([])
      setProfile(null)
      setNotice('You have been signed out')
    } catch (error) {
      setNotice(`Could not sign out: ${error.message}`)
    }
  }
  return (
    <LocaleContext.Provider value={language}>
    <div className="app-shell">
      {mobileOpen && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <button className="brand" onClick={() => navigate('/')} aria-label="Agrivision home">
          <span className="brand-symbol"><Sprout size={24} strokeWidth={2.2} /></span>
          <span className="brand-copy"><strong>Agri<span>vision</span></strong><small>{translate('LESOTHO · FARMER NETWORK')}</small></span>
        </button>
        <div className="season-chip"><span className="season-dot" /> {translate('Lesotho')} <span className="season-separator">/</span> {translate('Southern Africa')}</div>
        <nav className="sidebar-nav" aria-label={translate('Main navigation')}>
          {[...navGroups, ...(session?.role === 'admin' ? [{ label: 'ADMINISTRATION', links: [{ to: '/admin', label: 'Admin dashboard', icon: ShieldCheck }] }] : [])].map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-caption">{translate(group.label)}</p>
              {group.links.map(({ to, label, icon: Icon, badge }) => (
                <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>
                  <Icon size={18} strokeWidth={1.8} /><span>{translate(label)}</span>{badge && <span className="nav-badge">{badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="support-card"><span className="support-icon"><CircleHelp size={17} /></span><strong>{translate('Here for your farm')}</strong><p>{translate('Questions? Our community team is a message away.')}</p><button onClick={() => setNotice('Community support is available through your local cooperative administrator.')}>{translate('Get support')} <ArrowRight size={14} /></button></div>
          <button className="user-switch" onClick={() => session ? navigate('/profile') : setModal('auth')}>
            <span className="avatar avatar-user">{session?.name?.slice(0, 1) || 'A'}</span><span className="user-copy"><strong>{session?.name || translate('Welcome, farmer')}</strong><small>{session ? (session.role === 'admin' ? translate('Cooperative administrator') : translate('Farmer account')) : translate('Sign in or create an account')}</small></span><MoreHorizontal size={19} className="user-more" />
          </button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
          <button className="mobile-brand" onClick={() => navigate('/')} aria-label="Agrivision home"><Sprout size={23} /><strong>AgriVision</strong></button>
          <div className="breadcrumb"><span>{translate('Lesotho')}</span><ChevronRight size={14} /><strong>{getPageTitle(location.pathname, language)}</strong></div>
          <div className="topbar-right"><span className="today-label"><CalendarDays size={15} /> {todayLabel}</span><button className="language-toggle" type="button" aria-label={translate('Change language')} onClick={() => setLanguage((current) => current === 'en' ? 'st' : 'en')}><Languages size={14} /><span>{language === 'en' ? 'Sesotho' : translate('English')}</span></button><button className="mobile-basket" aria-label={`Basket, ${basket.length} items`} onClick={() => navigate('/marketplace')}><ShoppingBag size={18} />{basket.length > 0 && <span>{basket.length}</span>}</button>{session ? <button className="top-avatar" aria-label="View account" onClick={() => navigate('/profile')}>{session.name?.slice(0, 1) || 'F'}</button> : <div className="auth-entry-actions"><button className="button button-outline button-small" onClick={() => { setAuthAudience('farmer'); setModal('auth') }}>{translate('Farmer sign in')}</button><button className="button button-dark button-small" onClick={() => { setAuthAudience('admin'); setModal('auth') }}>{translate('Admin sign in')}</button></div>}</div>
        </header>
        <div className="page-content">
          {backendStatus && (!backendStatus.databaseConfigured || backendStatus.databaseConnected === false || !backendStatus.authenticationConfigured || !backendStatus.adminSetupConfigured) && <div className="backend-banner"><ShieldCheck size={17} /><span><strong>{!backendStatus.databaseConfigured || backendStatus.databaseConnected === false || !backendStatus.authenticationConfigured ? 'Account sign-in is not ready yet.' : 'Initial administrator setup is not ready yet.'}</strong>{!backendStatus.databaseConfigured && <> Add the private <code>MONGODB_URI</code> in Vercel to enable farmer accounts and saved records. </>}{backendStatus.databaseConfigured && backendStatus.databaseConnected === false && <> Atlas is rejecting the database connection. Check the database username and password in <code>MONGODB_URI</code>, including URL-encoding special characters, and confirm Atlas Network Access permits Vercel. </>}{!backendStatus.authenticationConfigured && <> Add <code>SESSION_SECRET</code> to enable secure sign-in. </>}{!backendStatus.adminSetupConfigured && <> To create the first administrator, also add <code>ADMIN_BOOTSTRAP_KEY</code> after the database is connected. </>}<a href="https://vercel.com/bonolo1/agriconnect-lesotho/settings/environment-variables" target="_blank" rel="noreferrer">Open Production settings <ExternalLink size={13} /></a></span></div>}
          <Routes>
            <Route path="/" element={authStatus === 'anonymous' ? <WelcomePage navigate={navigate} onSignIn={() => setModal('auth')} /> : <OverviewPage members={members} activities={activities} navigate={navigate} setNotice={setNotice} session={session} district={profile?.district || session?.district || 'Maseru'} onSignIn={() => setModal('auth')} />} />
            <Route path="/weather" element={<WeatherPage initialDistrict={profile?.district || session?.district || 'Maseru'} />} />
            <Route path="/markets" element={<MarketsPage setNotice={setNotice} session={session} onSignIn={() => setModal('auth')} />} />
            <Route path="/marketplace" element={<MarketplacePage basket={basket} setBasket={setBasket} setNotice={setNotice} />} />
            <Route path="/cooperative" element={<AccessGate authStatus={authStatus} session={session} onSignIn={() => setModal('auth')}><CooperativePage members={members} products={products} activities={activities} setNotice={setNotice} onJoin={() => addMember().catch((error) => setNotice(`Could not join the cooperative: ${error.message}`))} onAnnounce={() => setModal('activity')} onListProduce={() => setModal('produce')} /></AccessGate>} />
            <Route path="/alerts" element={<AlertsPage initialDistrict={profile?.district || session?.district || 'Maseru'} />} />
            <Route path="/crops" element={<CropsPage session={session} setNotice={setNotice} />} />
            <Route path="/stories" element={<StoriesPage session={session} setNotice={setNotice} />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/profile" element={<AccessGate authStatus={authStatus} session={session} onSignIn={() => setModal('auth')}><ProfilePage profile={profile || { ...session, phone: '' }} session={session} onSave={updateProfile} onSignOut={signOut} /></AccessGate>} />
            <Route path="/settings" element={<AccessGate authStatus={authStatus} session={session} onSignIn={() => setModal('auth')}><SettingsPage setNotice={setNotice} /></AccessGate>} />
            <Route path="/admin" element={<AccessGate authStatus={authStatus} session={session} onSignIn={() => setModal('auth')} role="admin"><AdminPage setNotice={setNotice} onAnnounce={() => setModal('activity')} /></AccessGate>} />
            <Route path="*" element={<OverviewPage members={members} activities={activities} navigate={navigate} setNotice={setNotice} session={session} district={profile?.district || session?.district || 'Maseru'} onSignIn={() => setModal('auth')} />} />
          </Routes>
        </div>
        <TranslateContent><footer className="footer"><span>Made for the people who grow Lesotho <Heart size={13} fill="currentColor" /></span><span>AgriVision Lesotho <i>·</i> Helping our communities thrive</span></footer></TranslateContent>
      </main>
      <nav className="mobile-tabbar" aria-label="Mobile navigation">
        {[['/', 'Home', LayoutDashboard], ['/marketplace', 'Browse', ShoppingBag], ['/weather', 'Weather', CloudSun], ['/cooperative', 'Community', Users], ['/profile', 'Profile', UserRound]].map(([to, label, Icon]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `mobile-tab ${isActive ? 'mobile-tab-active' : ''}`}>
            <span className="mobile-tab-icon"><Icon size={19} />{to === '/marketplace' && basket.length > 0 && <i>{basket.length}</i>}</span><small>{translate(label)}</small>
          </NavLink>
        ))}
      </nav>
      {modal === 'auth' ? <AuthModal audience={authAudience} onAudienceChange={setAuthAudience} backendStatus={backendStatus} onClose={() => setModal('')} onSession={updateSession} onAdminSetup={() => setModal('admin-bootstrap')} /> : modal === 'admin-bootstrap' ? <AdminBootstrapModal onClose={() => setModal('')} onSession={updateSession} /> : modal && <Modal type={modal} onClose={() => setModal('')} onActivity={addActivity} onProduct={addProduct} />}
      {notice && <div className="toast" role="status"><CheckCircle2 size={18} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={15} /></button></div>}
    </div>
    </LocaleContext.Provider>
  )
}

function getPageTitle(path, language) {
  return translateText(({ '/': 'Overview', '/weather': 'Weather', '/markets': 'Market prices', '/marketplace': 'Fresh produce', '/cooperative': 'Cooperative', '/resources': 'Farming resources', '/stories': 'Success stories', '/crops': 'Crop prices', '/alerts': 'Alerts & protection', '/profile': 'My profile', '/settings': 'Settings', '/admin': 'Administration' })[path] || 'Overview', language)
}

function PageIntro({ eyebrow, title, description, action, onAction, actionIcon: ActionIcon = Plus }) {
  const t = useTranslate()
  return <div className="page-intro"><div><p className="eyebrow">{t(eyebrow)}</p><h1>{t(title)}</h1><p className="intro-description">{t(description)}</p></div>{action && <button className="button button-dark" onClick={onAction}><ActionIcon size={16} />{t(action)}</button>}</div>
}

function AccessGate({ authStatus, session, onSignIn, role, children }) {
  const t = useTranslate()
  if (authStatus === 'checking') return <div className="access-state"><ShieldCheck size={26} /><h2>{t('Checking your account…')}</h2></div>
  if (!session) return <div className="access-state"><LockKeyhole size={26} /><p className="eyebrow">{t('YOUR ACCOUNT')}</p><h2>{t('Sign in to continue.')}</h2><p>{t('Your account and cooperative details are available to registered farmers and administrators.')}</p><button className="button button-dark" onClick={onSignIn}><UserRound size={15} /> {t('Sign in or create an account')}</button></div>
  if (role && session.role !== role) return <div className="access-state"><ShieldCheck size={26} /><h2>{t('Administrator access only.')}</h2><p>{t('Sign in with an approved cooperative administrator account to view this page.')}</p></div>
  return children
}

function OverviewPage({ members, activities, navigate, setNotice, session, district, onSignIn }) {
  const t = useTranslate()
  const language = useContext(LocaleContext)
  const { weather, error, loading } = useDistrictWeather(district)
  const { data: marketData, error: marketError, loading: marketLoading } = useMarketPrices()
  const marketRows = (marketData?.observations || [])
    .filter((item) => normalizeMarketName(item.market) === normalizeMarketName(district))
    .slice(0, 3)
  const current = weather?.current
  const currentDescription = current ? weatherDescription(current.weather_code) : { condition: 'Conditions unavailable', Icon: Cloud }
  const CurrentIcon = currentDescription.Icon
  const forecast = weather?.daily?.time?.slice(0, 5).map((date, index) => {
    const description = weatherDescription(weather.daily.weather_code[index])
    return {
      date,
      day: index === 0 ? t('TODAY') : new Date(`${date}T12:00:00`).toLocaleDateString(language === 'st' ? 'st-LS' : 'en', { weekday: 'short' }).toUpperCase(),
      high: `${Math.round(weather.daily.temperature_2m_max[index])}°`,
      low: `${Math.round(weather.daily.temperature_2m_min[index])}°`,
      ...description,
    }
  }) || []
  const rainProbability = weather?.daily?.precipitation_probability_max?.[0]
  return <TranslateContent>
    <div className="welcome-strip"><div className="welcome-text"><p className="eyebrow light-eyebrow"><span className="eyebrow-dot" /> {t('YOUR FARM, AT A GLANCE')}</p><h1>{t('Growing together,')}<br /><span>{t('farming smarter.')}</span></h1><p>{t('A good morning starts with a little more know-how. Here’s what’s happening across your farm and community.')}</p><div className="welcome-actions"><button className="button button-cream" onClick={() => navigate('/cooperative')}>{t('Explore your community')} <ArrowRight size={16} /></button><span><MapPin size={14} /> Maseru, Lesotho</span></div></div><div className="welcome-art" aria-hidden="true"><div className="hero-quote"><span className="quote-leaf"><Leaf size={17} /></span><span>{t('Rooted in community.')}<br /><strong>{t('Growing for tomorrow.')}</strong></span></div><span className="hero-orbit orbit-one" /><span className="hero-orbit orbit-two" /><span className="sun-disc" /><span className="hill hill-back" /><span className="hill hill-front" /><span className="field-line line-one" /><span className="field-line line-two" /><span className="field-line line-three" /><span className="hero-tree tree-one" /><span className="hero-tree tree-two" /></div></div>
    <section className="stats-row" aria-label="Your farm statistics">
      <StatCard label={t('Co-op neighbours')} value={session ? members.length : '248'} note={session ? 'Registered cooperative members' : 'Illustrative community total'} icon={Users} color="green" />
      <StatCard label={t('Produce shared')} value="1,420 kg" note="Illustrative co-op total" icon={ShoppingBag} color="green" />
      <StatCard label={t('Current weather')} value={current ? `${Math.round(current.temperature_2m)}°` : loading ? '…' : '—'} note={current ? `${district} · Open-Meteo` : error ? 'Live data unavailable' : 'Loading district forecast'} icon={CloudSun} color="green" />
      <StatCard label={t('Growing guides')} value="6" note="Practical farming resources" icon={BookOpen} color="green" />
    </section>
    <div className="dashboard-grid">
      <section className="panel weather-panel"><div className="section-heading"><div><p className="eyebrow">YOUR LOCAL FORECAST</p><h2>A little look at the skies</h2></div><button className="text-link" onClick={() => navigate('/weather')}>Full forecast <ArrowRight size={14} /></button></div><div className="weather-current"><div className="weather-symbol"><CurrentIcon size={37} strokeWidth={1.6} /></div><div><span className="weather-temp">{current ? `${Math.round(current.temperature_2m)}` : '—'}<small>°C</small></span><p>{current ? currentDescription.condition : loading ? 'Checking the skies…' : 'Live conditions unavailable'}</p></div><div className="weather-location"><MapPin size={13} /> {district} <span>·</span> {current ? 'Open-Meteo' : 'Lesotho'}</div></div>{error && <div className="api-error-banner" role="status"><CloudSun size={17} /><span>Live weather could not be loaded: {error}.</span></div>}<div className="forecast-strip">{forecast.map(({ date, day, high, low, Icon, accent }) => <div className="forecast-day" key={date}><span>{day}</span><Icon size={19} strokeWidth={1.7} className={accent === 'sunny' ? 'icon-sunny' : accent === 'rainy' ? 'icon-rainy' : ''} /><strong>{high}</strong><small>{low}</small></div>)}</div><div className="weather-notice"><span><Droplets size={15} />{rainProbability == null ? 'Forecast guidance is unavailable right now.' : `${rainProbability}% chance of rain today in ${district}. Use local conditions to plan outdoor work.`}</span><button onClick={() => navigate('/weather')} aria-label="Weather recommendations"><ArrowRight size={15} /></button></div><div className="data-label"><i /> {weather ? 'LIVE FORECAST · OPEN-METEO' : 'LIVE DISTRICT FORECAST'}</div></section>
      <section className="panel market-panel">
        <div className="section-heading"><div><p className="eyebrow">THE LATEST</p><h2>{t('Market watch')}</h2></div><button className="icon-link" aria-label={t('See all market prices')} onClick={() => navigate('/markets')}><ArrowRight size={17} /></button></div>
        <p className="subtle-copy market-date"><Clock3 size={13} />{marketLoading ? t('Loading market prices…') : marketError ? t('Market price data could not be loaded.') : marketRows.length ? `${t('Latest observations in')} ${t(district)}` : t('No recent retail observations for this district.')}</p>
        {marketError && <p className="market-error" role="status">{marketError}</p>}
        <div className="market-list">{marketRows.map((item) => <MarketRow key={`${item.market}-${item.commodity}`} item={item} language={language} />)}</div>
        <button className="market-all" onClick={() => navigate('/markets')}>{t('See all retail prices')} <ArrowRight size={14} /></button>
      </section>
      <section className="panel community-panel"><div className="section-heading"><div><p className="eyebrow">GROWING STRONGER TOGETHER</p><h2>From the community</h2></div><button className="text-link" onClick={() => navigate('/cooperative')}>Meet your co-op <ArrowRight size={14} /></button></div><div className="community-callout"><span className="community-illustration"><Users size={27} /></span><div><strong>Good things grow together.</strong><p>Bring your produce to market as one. Your cooperative is stronger with you in it.</p></div><button className="circle-arrow" onClick={() => navigate('/cooperative')} aria-label="Explore cooperative"><ArrowRight size={16} /></button></div><div className="community-bottom"><div><strong>248</strong><span>farmers in your network</span></div><div className="avatar-stack"><span className="avatar avatar-a">MM</span><span className="avatar avatar-b">TR</span><span className="avatar avatar-c">LN</span><span className="avatar avatar-extra">+245</span></div><span className="live-tag"><i /> OPEN</span></div></section>
      <section className="panel activity-panel"><div className="section-heading"><div><p className="eyebrow">COMING UP</p><h2>Co-op noticeboard</h2></div><button className="text-link" onClick={() => navigate('/cooperative')}>All updates <ArrowRight size={14} /></button></div><div className="activity-list">{activities.slice(0, 3).map((activity, index) => { const Icon = activity.icon === 'feather' ? Feather : activity.icon === 'users' ? Users : activity.icon === 'sprout' ? Sprout : CalendarDays; return <div className="activity-row" key={`${activity.title}-${index}`}><span className={`activity-icon icon-${activity.color || 'green'}`}><Icon size={16} /></span><div className="activity-copy"><strong>{activity.title}</strong><p>{activity.detail}</p></div><span className="activity-time">{activity.time}</span></div> })}</div></section>
    </div>
    {!session && <div className="overview-auth-cta"><span><ShieldCheck size={17} /><strong>Grow with your community.</strong> Create a farmer account to share produce and connect with your cooperative.</span><button className="button button-dark" onClick={onSignIn}>Get started <ArrowRight size={14} /></button></div>}
    <SdgStrip />
    <SdgImpact />
  </TranslateContent>
}

function StatCard({ label, value, note, icon: Icon, color }) {
  const t = useTranslate()
  return <article className="stat-card"><span className={`stat-icon icon-${color}`}><Icon size={18} strokeWidth={1.9} /></span><span className="stat-label">{t(label)}</span><strong className="stat-value">{value}</strong><span className="stat-note">{t(note)}</span></article>
}

function MarketRow({ item, language }) {
  const t = useTranslate()
  return <div className="market-row"><span className="market-icon icon-green"><Wheat size={16} /></span><span className="market-product"><strong>{t(item.commodity)}</strong><small>{t(item.market)} · {t(item.unit)}</small></span><span className="market-price">{formatMarketPrice(item)}</span><span className="market-observation-date">{formatMarketDate(item.date, language)}</span></div>
}

function SdgStrip() {
  const goals = [{ n: '01', color: 'sdg-one', title: 'No poverty', detail: 'Stronger market access' }, { n: '02', color: 'sdg-two', title: 'Zero hunger', detail: 'More resilient harvests' }, { n: '12', color: 'sdg-twelve', title: 'Responsible production', detail: 'Less waste, healthier land' }, { n: '13', color: 'sdg-thirteen', title: 'Climate action', detail: 'Prepared for changing weather' }]
  return <TranslateContent><section className="sdg-strip"><div className="sdg-intro"><span className="sdg-globe"><Leaf size={19} /></span><span><strong>Growing towards a better future</strong><small>A local platform with a global purpose.</small></span></div><div className="sdg-goals">{goals.map((goal) => <div className="sdg-goal" key={goal.n}><span className={`sdg-number ${goal.color}`}>{goal.n}</span><span><strong>{goal.title}</strong><small>{goal.detail}</small></span></div>)}</div><button className="sdg-link" onClick={() => document.getElementById('sdg-impact')?.scrollIntoView({ behavior: 'smooth' })} aria-label="See SDG impact"><ArrowRight size={16} /></button></section></TranslateContent>
}

function SdgImpact() {
  const items = [
    { number: '01', color: 'sdg-one', title: 'No poverty', text: 'Help smallholders reach more buyers through cooperative marketing.' },
    { number: '02', color: 'sdg-two', title: 'Zero hunger', text: 'Make practical growing advice and farm-management tools easier to find, share and use.' },
    { number: '12', color: 'sdg-twelve', title: 'Responsible consumption & production', text: 'Support sustainable growing and better coordination to reduce farm waste.' },
    { number: '13', color: 'sdg-thirteen', title: 'Climate action', text: 'Help farmers prepare for changing conditions with district weather information and climate-smart guidance.' },
  ]
  return <TranslateContent><section className="sdg-impact" id="sdg-impact"><div className="sdg-impact-heading"><p className="eyebrow">LOCAL ACTION, SHARED GOALS</p><h2>Small farms can move the world forward.</h2><p>AgriVision is designed to support the United Nations Sustainable Development Goals in practical ways that matter to Lesotho’s farming communities.</p></div><div className="sdg-impact-grid">{items.map((item) => <article className="sdg-impact-card" key={item.number}><span className={`sdg-number ${item.color}`}>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section></TranslateContent>
}

function PageCard({ children, className = '' }) { return <section className={`panel page-card ${className}`}>{children}</section> }

function weatherDescription(code) {
  if ([0].includes(code)) return { condition: 'Clear sky', Icon: Sun, accent: 'sunny' }
  if ([1, 2].includes(code)) return { condition: 'Partly cloudy', Icon: CloudSun, accent: '' }
  if ([3, 45, 48].includes(code)) return { condition: code === 3 ? 'Overcast' : 'Fog', Icon: Cloud, accent: '' }
  if ([51, 53, 55, 56, 57].includes(code)) return { condition: 'Drizzle', Icon: CloudDrizzle, accent: 'rainy' }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { condition: 'Rain showers', Icon: CloudRain, accent: 'rainy' }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: 'Snowfall', Icon: CloudDrizzle, accent: 'rainy' }
  if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorm', Icon: CloudRain, accent: 'rainy' }
  return { condition: 'Conditions unavailable', Icon: Cloud, accent: '' }
}

function useDistrictWeather(district) {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    apiRequest(`/api/weather?district=${encodeURIComponent(district)}`)
      .then((result) => { if (active) { setWeather(result); setError('') } })
      .catch((requestError) => { if (active) { setWeather(null); setError(requestError.message) } })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [district])
  return { weather, error, loading }
}

function useMarketPrices() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    apiRequest('/api/market-prices')
      .then((result) => { if (active) { setData(result); setError('') } })
      .catch((requestError) => { if (active) { setData(null); setError(requestError.message) } })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return { data, error, loading }
}

function normalizeMarketName(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function formatMarketPrice(item) {
  const currency = item.currency === 'LSL' ? 'M' : item.currency
  return `${currency} ${Number(item.price).toFixed(2)}`
}

function formatMarketDate(value, language) {
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(language === 'st' ? 'st-LS' : 'en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function WeatherPage({ initialDistrict }) {
  const t = useTranslate()
  const language = useContext(LocaleContext)
  const [district, setDistrict] = useState(initialDistrict)
  const [period, setPeriod] = useState('7 days')
  const { weather, error, loading } = useDistrictWeather(district)
  const rows = weather?.daily?.time?.map((date, index) => {
    const description = weatherDescription(weather.daily.weather_code[index])
    const dateValue = new Date(`${date}T12:00:00`)
    return {
      day: index === 0 ? t('Today') : dateValue.toLocaleDateString(language === 'st' ? 'st-LS' : 'en', { weekday: 'long' }),
      date: dateValue.toLocaleDateString(language === 'st' ? 'st-LS' : 'en', { day: 'numeric', month: 'short' }),
      high: `${Math.round(weather.daily.temperature_2m_max[index])}°`,
      low: `${Math.round(weather.daily.temperature_2m_min[index])}°`,
      rain: `${weather.daily.precipitation_probability_max[index] ?? 0}%`,
      wind: `${Math.round(weather.daily.wind_speed_10m_max[index])} km/h`,
      ...description,
    }
  }) || []
  const current = weather?.current
  const currentDescription = current ? weatherDescription(current.weather_code) : { condition: 'Live conditions unavailable', Icon: Cloud }
  const CurrentIcon = currentDescription.Icon
  return <TranslateContent>
    <PageIntro eyebrow="PLAN WITH THE SKY" title="Weather for your farm" description="Live district forecast from Open-Meteo. Forecasts are guidance, not official severe-weather alerts." />
    <div className="weather-controls"><label className="field-label">{t('YOUR DISTRICT')}<select value={district} onChange={(e) => setDistrict(e.target.value)}>{districts.map((d) => <option key={d}>{d}</option>)}</select></label><div className="segmented-control" aria-label={t('Forecast period')}>{['3 days', '7 days'].map((x) => <button key={x} className={period === x ? 'selected' : ''} onClick={() => setPeriod(x)}>{t(x)}</button>)}</div><span className="forecast-updated"><Clock3 size={14} />{loading ? t('Updating…') : weather ? `Open-Meteo · ${weather.timezone}` : t('Live data unavailable')}</span></div>
    {error && <div className="api-error-banner" role="status"><CloudSun size={17} /><span>Live weather could not be loaded: {error}. Please try another district or refresh.</span></div>}
    <PageCard className="current-weather-card"><div className="current-weather-main"><div><span className="weather-pill"><span /> {t(weather ? 'LIVE CONDITIONS' : 'CURRENT CONDITIONS')}</span><h2>{current ? `${t(currentDescription.condition)} in ${district}.` : loading ? t('Checking the skies…') : `No live reading for ${district}.`}</h2><p><MapPin size={15} /> {district}, Lesotho {current && <><span>·</span> {new Date(current.time).toLocaleString(language === 'st' ? 'st-LS' : 'en', { dateStyle: 'medium', timeStyle: 'short' })}</>}</p></div><div className="current-weather-reading"><CurrentIcon size={55} strokeWidth={1.4} /><strong>{current ? `${Math.round(current.temperature_2m)}°` : '—'}<small>C</small></strong><span>{t(currentDescription.condition)}</span></div></div><div className="current-weather-stats"><div><Thermometer size={17} /><span>{t('Feels like')} <strong>{current ? `${Math.round(current.apparent_temperature)}°` : '—'}</strong></span></div><div><Droplets size={17} /><span>{t('Humidity')} <strong>{current ? `${current.relative_humidity_2m}%` : '—'}</strong></span></div><div><Wind size={17} /><span>{t('Wind')} <strong>{current ? `${Math.round(current.wind_speed_10m)} km/h` : '—'}</strong></span></div><div><Cloud size={17} /><span>{t('Cloud cover')} <strong>{current ? `${current.cloud_cover}%` : '—'}</strong></span></div></div></PageCard>
    <div className="weather-section-head"><div><p className="eyebrow">THE DAYS AHEAD</p><h2>{period} in {district}</h2></div><span className="sample-chip">{weather ? 'LIVE FORECAST' : 'LIVE DATA REQUIRED'}</span></div>
    <PageCard className="forecast-table-card"><div className="forecast-table">{rows.slice(0, period === '3 days' ? 3 : 7).map((d, i) => <div className={`forecast-row ${i === 0 ? 'today-row' : ''}`} key={`${d.day}-${i}`}><div className="forecast-date"><strong>{d.day}</strong><small>{d.date}</small></div><d.Icon size={21} strokeWidth={1.7} className={d.accent === 'sunny' ? 'icon-sunny' : d.accent === 'rainy' ? 'icon-rainy' : ''} /><span className="forecast-condition">{d.condition}</span><span className="forecast-high">{d.high}</span><span className="forecast-low">{d.low}</span><span className="rain-chance"><Droplets size={14} />{d.rain}</span><span className="forecast-wind"><Wind size={14} />{d.wind}</span></div>)}{!loading && rows.length === 0 && <div className="empty-state"><CloudSun size={22} /><strong>No forecast available</strong><span>Try again later.</span></div>}</div></PageCard>
    <div className="weather-bottom-grid"><PageCard className="advisory-card"><span className="advisory-icon"><Sprout size={20} /></span><p className="eyebrow">A THOUGHT FOR YOUR FARM</p><h3>{rows[0]?.rain && Number.parseInt(rows[0].rain, 10) >= 50 ? 'Plan around likely rainfall.' : 'Make the most of the dry days.'}</h3>    <p>{rows.length ? rows[0].rain && Number.parseInt(rows[0].rain, 10) >= 50 ? `The forecast for ${district} shows a ${rows[0].rain} chance of rain today. Consider protecting stored crops and allowing extra drying time.` : `The forecast for ${district} shows a lower chance of rain today. It may be a useful window for outdoor work; check local conditions before starting.` : 'Live forecast guidance will appear when weather data is available.'}</p><span className="advisory-foot"><CheckCircle2 size={14} /> General guidance · use your local knowledge</span></PageCard><PageCard className="alert-card"><div className="section-heading"><div><p className="eyebrow">WEATHER WATCH</p><h3>Forecast data, not warnings</h3></div><ShieldCheck size={19} className="alert-shield" /></div><div className="alert-banner"><CloudRain size={18} /><div><strong>Check official alerts separately</strong><p>Open-Meteo forecast data is not an official severe-weather warning service. Follow Lesotho’s meteorological authorities for warnings.</p></div></div><p className="alert-note"><i /> Forecast source: Open-Meteo · automatically refreshed by district.</p></PageCard></div>
    <p className="disclaimer"><ShieldCheck size={14} /> Live forecasts are supplied by Open-Meteo. Availability and accuracy vary; this is not an official weather alert service.</p>
  </TranslateContent>
}

function MarketsPage({ setNotice, session, onSignIn }) {
  const t = useTranslate()
  const language = useContext(LocaleContext)
  const { data, error, loading } = useMarketPrices()
  const [selectedMarket, setSelectedMarket] = useState(session?.district || 'Maseru')
  const [subscribed, setSubscribed] = useState(false)
  const markets = data?.markets || []
  const observations = (data?.observations || []).filter((item) => selectedMarket === 'all' || item.market === selectedMarket)

  useEffect(() => {
    const preferred = session?.district || 'Maseru'
    const match = markets.find((market) => normalizeMarketName(market) === normalizeMarketName(preferred))
    if (match) setSelectedMarket(match)
  }, [data?.markets, session?.district])

  useEffect(() => {
    if (!session) { setSubscribed(false); return undefined }
    let activeRequest = true
    apiRequest('/api/market-alerts')
      .then((result) => { if (activeRequest) setSubscribed(result.enabled) })
      .catch((error) => { if (activeRequest) setNotice(`Could not load market alert preference: ${error.message}`) })
    return () => { activeRequest = false }
  }, [session?.id])
  const toggleAlerts = async () => {
    if (!session) { onSignIn(); return }
    try {
      const result = await apiRequest('/api/market-alerts', { method: 'PUT', body: { enabled: !subscribed } })
      setSubscribed(result.enabled)
      setNotice(result.enabled ? 'Market alert preference saved. Price notifications are not delivered yet.' : 'Market alerts turned off.')
    } catch (error) {
      setNotice(`Could not update market alerts: ${error.message}`)
    }
  }
  return <TranslateContent>
    <PageIntro eyebrow="LATEST RETAIL PRICE OBSERVATIONS" title="Retail food prices by market" description="Latest recorded retail food prices by market in Lesotho. They are consumer prices—not what farmers receive when selling crops." action={session ? 'Save alert preference' : 'Sign in for price alerts'} actionIcon={Bell} onAction={toggleAlerts} />
    <div className="weather-controls market-price-controls">
      <label className="field-label">{t('Select market')}<select value={selectedMarket} onChange={(event) => setSelectedMarket(event.target.value)}><option value="all">{t('All markets')}</option>{markets.map((market) => <option key={market} value={market}>{t(market)}</option>)}</select></label>
      <span className="forecast-updated"><Clock3 size={14} />{loading ? t('Loading verified prices…') : observations.length ? `${t('Latest observation')}: ${formatMarketDate(observations[0].date, language)}` : t('No recent verified prices are available for this market.')}</span>
    </div>
    <PageCard className="comparison-card market-data-card">
      {error && <div className="api-error-banner" role="alert"><Info size={17} /><span>{t('Market price data could not be loaded.')} {error}</span></div>}
      {loading && <p className="story-meta">{t('Loading verified prices…')}</p>}
      {!loading && !error && observations.length === 0 && <div className="empty-state"><Info size={22} /><strong>{t('No recent verified prices are available for this market.')}</strong></div>}
      {observations.length > 0 && <div className="comparison-scroll"><table className="comparison-table market-price-table"><thead><tr><th>{t('FOOD / COMMODITY')}</th><th>{t('RETAIL PRICE')}</th><th>{t('UNIT')}</th><th>{t('MARKET')}</th><th>{t('OBSERVED')}</th></tr></thead><tbody>{observations.map((item) => <tr key={`${item.market}-${item.commodity}-${item.unit}`}><td>{t(item.commodity)}</td><td>{formatMarketPrice(item)}</td><td>{t(item.unit)}</td><td>{t(item.market)}</td><td>{formatMarketDate(item.date, language)}</td></tr>)}</tbody></table></div>}
    </PageCard>
    <p className="disclaimer"><Info size={14} />{t('Retail prices are not farm-gate prices. Check price, grade and buyer terms locally before selling.')}</p>
    <div className="market-source-note"><span>{t('Source: World Food Programme (WFP) Price Database, via Lesotho Bureau of Statistics and FAO GIEWS.')}</span><a href={data?.sourceUrl || 'https://data.humdata.org/dataset/wfp-food-prices-for-lesotho'} target="_blank" rel="noreferrer">{t('View source')} <ExternalLink size={13} /></a><small>{t('Distributed by HDX · CC BY-IGO 3.0')} · {t('Only actual retail observations from the last 90 days are shown.')}</small></div>
    <PageCard className="alert-subscribe"><span className="subscribe-icon"><Bell size={19} /></span><p className="eyebrow">A HELPFUL HEADS-UP</p><h3>{subscribed ? 'Preference saved.' : 'Hear when prices change.'}</h3><p>Save this preference to your account. Notifications are not delivered yet.</p><button className={subscribed ? 'button button-outline' : 'button button-dark'} onClick={toggleAlerts}>{subscribed ? <><Check size={15} /> Alerts preference on</> : <><Bell size={15} /> {session ? 'Save preference' : 'Sign in to save'}</>}</button></PageCard>
  </TranslateContent>
}

function MarketplacePage({ basket, setBasket, setNotice }) {
  const t = useTranslate()
  const [category, setCategory] = useState('All produce')
  const [search, setSearch] = useState('')
  const products = [
    { id: 'tomatoes', name: 'Garden tomatoes', farmer: 'Local grower', category: 'Vegetables', price: 35, unit: 'kg', image: 'photo-1546094096-0df4bcaaa337', color: 'tomato' },
    { id: 'potatoes', name: 'Fresh potatoes', farmer: 'Family farm', category: 'Vegetables', price: 28, unit: 'kg', image: 'photo-1518977676601-b53f82aba655', color: 'potato' },
    { id: 'maize', name: 'Maize meal', farmer: 'Community mill', category: 'Grains', price: 45, unit: '2 kg bag', image: 'photo-1551754655-cd27e38d2076', color: 'maize' },
    { id: 'spinach', name: 'Leafy greens', farmer: 'Market garden', category: 'Vegetables', price: 18, unit: 'bunch', image: 'photo-1576045057995-568f588f82fb', color: 'greens' },
  ]
  const categories = ['All produce', 'Vegetables', 'Grains']
  const visible = products.filter((item) => (category === 'All produce' || item.category === category) && `${item.name} ${item.category} ${item.farmer}`.toLowerCase().includes(search.toLowerCase()))
  const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = basket.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const addItem = (product) => {
    setBasket((current) => {
      const found = current.find((item) => item.id === product.id)
      return found ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
    setNotice(`${t(product.name)} ${t('added to your demo basket')}`)
  }
  const removeItem = (id) => setBasket((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0))
  return <TranslateContent>
    <div className="marketplace-hero">
      <div className="marketplace-hero-copy"><p className="eyebrow">{t('FRESH FROM LESOTHO FARMS')}</p><h1>{t('Good food.')}<br /><span>{t('Grown close to home.')}</span></h1><p>{t('Browse local produce and support the people who grow it.')}</p><div className="marketplace-location"><MapPin size={15} /> {t('Local farmer listings')} <span>·</span> Lesotho</div></div>
      <div className="marketplace-hero-art" aria-hidden="true"><span className="marketplace-sun" /><span className="marketplace-hill" /><span className="marketplace-basket-art"><ShoppingBag size={68} strokeWidth={1.2} /></span></div>
    </div>
    <div className="marketplace-disclaimer"><InfoIcon /><span><strong>{t('Demonstration marketplace.')}</strong> {t('Listings, seller names and prices are examples only—not real offers or live availability.')}</span></div>
    <div className="marketplace-toolbar"><div><p className="eyebrow">{t('THE FARMER’S MARKET')}</p><h2>{t('Fresh picks for you')}</h2></div><label className="search-field marketplace-search"><Search size={16} /><input placeholder={t('Search produce…')} aria-label={t('Search produce')} value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>
    <div className="marketplace-categories" aria-label={t('Filter produce')}>{categories.map((item) => <button key={item} className={category === item ? 'market-category-active' : ''} onClick={() => setCategory(item)}>{t(item)}</button>)}</div>
    <div className="marketplace-layout"><section className="marketplace-grid" aria-label={t('Example produce listings')}>{visible.map((product) => {
      const quantity = basket.find((item) => item.id === product.id)?.quantity || 0
      return <article className="marketplace-product" key={product.id}><div className={`marketplace-product-image ${product.color}`}><img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=700&q=80`} alt="" loading="lazy" /><span className="marketplace-sample-tag">{t('SAMPLE')}</span><button aria-label={`${t('Add')} ${t(product.name)} ${t('to saved produce')}`} className="marketplace-favourite" onClick={() => setNotice(t('Saved lists are not connected in this demonstration.'))}><Heart size={17} /></button></div><div className="marketplace-product-copy"><span className="marketplace-product-category">{t(product.category)}</span><h3>{t(product.name)}</h3><p><MapPin size={13} /> {t(product.farmer)} · {t('example seller')}</p><div className="marketplace-product-bottom"><strong>M {product.price}<small> / {t(product.unit)}</small></strong>{quantity > 0 ? <div className="basket-quantity"><button aria-label={`${t('Remove one')} ${t(product.name)}`} onClick={() => removeItem(product.id)}><MinusIcon /></button><span>{quantity}</span><button aria-label={`${t('Add another')} ${t(product.name)}`} onClick={() => addItem(product)}><Plus size={14} /></button></div> : <button className="add-basket-button" onClick={() => addItem(product)}><Plus size={15} /> {t('Add')}</button>}</div></div></article>
    })}{visible.length === 0 && <div className="empty-state"><Search size={22} /><strong>{t('No produce found')}</strong><span>{t('Try another search or category.')}</span></div>}</section>
      <aside className="marketplace-basket"><div className="marketplace-basket-heading"><span><ShoppingBag size={18} /></span><div><h2>{t('Your basket')}</h2><small>{totalItems} {t('example')} {totalItems === 1 ? t('item') : t('items')}</small></div></div>{basket.length ? <><div className="marketplace-basket-items">{basket.map((item) => <div className="marketplace-basket-item" key={item.id}><span>{t(item.name)}<small>M {item.price} × {item.quantity}</small></span><strong>M {(item.price * item.quantity).toFixed(2)}</strong></div>)}</div><div className="marketplace-basket-total"><span>{t('Example total')}</span><strong>M {totalPrice.toFixed(2)}</strong></div><button className="button button-dark marketplace-checkout" onClick={() => setNotice(t('Checkout is not connected. No order has been placed; these are example listings.'))}>{t('Review basket')} <ArrowRight size={15} /></button></> : <div className="marketplace-basket-empty"><ShoppingBag size={25} /><p>{t('Your basket is waiting.')}</p><small>{t('Add a sample listing to see how the basket works.')}</small></div>}<p className="marketplace-basket-note"><ShieldCheck size={14} /> {t('Demo only · no orders or payments are processed.')}</p></aside>
    </div>
  </TranslateContent>
}

function InfoIcon() { return <span className="marketplace-info-icon"><Info size={16} /></span> }
function MinusIcon() { return <span aria-hidden="true">−</span> }

function CooperativePage({ members, products, activities, setNotice, onJoin, onAnnounce, onListProduce }) {
  const t = useTranslate()
  const [tab, setTab] = useState('Members')
  const [search, setSearch] = useState('')
  const shownMembers = members.filter((m) => `${m.name} ${m.farm} ${m.product}`.toLowerCase().includes(search.toLowerCase()))
  return <TranslateContent>
    <PageIntro eyebrow="OUR STRENGTH IS IN EACH OTHER" title="Your cooperative, your community." description="Meet the people nearby, share what you grow, and get more of your produce to market together." action="Join the cooperative" actionIcon={Users} onAction={onJoin} />
    <div className="co-op-banner"><div className="co-op-banner-copy"><span className="co-op-live"><i /> {t('YOUR LOCAL NETWORK')}</span><h2>{t('Growing stronger,')}<br />{t('side by side.')}</h2><p>{t('Small farms can make a big impact. Pooling your produce means more choices, more negotiating power, and a stronger community.')}</p><button className="button button-cream" onClick={onJoin}>{t('Become a member')} <ArrowRight size={15} /></button></div><div className="coop-art" aria-hidden="true"><span className="coop-sun" /><span className="coop-hill-one" /><span className="coop-hill-two" /><span className="coop-person person-one" /><span className="coop-person person-two" /><span className="coop-person person-three" /><span className="coop-basket"><Wheat size={38} /></span></div></div>
    <div className="coop-metrics"><div><Users size={17} /><strong>{members.length}</strong><span>registered members</span></div><div><ShoppingBag size={17} /><strong>{products.length}</strong><span>produce lots listed</span></div><div><Activity size={17} /><strong>—</strong><span>active groups · data not connected</span></div><div><BadgeCheck size={17} /><strong>—</strong><span>completed sales · data not connected</span></div></div>
    <div className="co-op-tabs">{['Members', 'Produce', 'Announcements', 'Opportunities'].map((x) => <button key={x} className={tab === x ? 'active-tab' : ''} onClick={() => setTab(x)}>{t(x)}{x === 'Members' && <span>{members.length}</span>}{x === 'Produce' && <span>{products.length}</span>}</button>)}</div>
    {tab === 'Members' && <PageCard className="members-card"><div className="members-heading"><div><p className="eyebrow">{t('GOOD NEIGHBOURS, GOOD GROWERS')}</p><h2>{t('Meet your fellow farmers')}</h2></div><label className="search-field member-search"><Search size={15} /><input placeholder={t('Find a farmer…')} value={search} onChange={(e) => setSearch(e.target.value)} /></label></div><div className="member-list">{shownMembers.map((m, i) => <div className="member-row" key={`${m.name}-${i}`}><span className={`avatar member-avatar avatar-${m.color || 'sage'}`}>{m.initials}</span><span className="member-name"><strong>{m.name}</strong><small>{m.farm}</small></span><span className="member-produce"><span>{t('AVAILABLE PRODUCE')}</span>{t(m.product)}</span><span className={`member-active ${i % 3 === 1 ? 'recently' : ''}`}><i />{i % 3 === 1 ? t('Active this week') : t('Open to marketing')}</span><button className="icon-button" onClick={() => navigator.clipboard?.writeText(m.name).then(() => {})} aria-label={`Copy ${m.name}'s name`}><ExternalLink size={15} /></button></div>)}{shownMembers.length === 0 && <div className="empty-state"><Search size={22} /><strong>{t('No members found')}</strong></div>}</div></PageCard>}
    {tab === 'Produce' && <PageCard className="produce-card"><div className="section-heading"><div><p className="eyebrow">BRINGING GOOD THINGS TOGETHER</p><h2>Produce available for group marketing</h2></div><button className="button button-dark button-small" onClick={onListProduce}><Plus size={14} /> Share produce</button></div><p className="produce-intro">Listings are demonstration records stored on this device. Contact farmers through your cooperative to confirm availability before making plans.</p><div className="produce-list">{products.filter((item) => item.type === 'Vegetables').map((item, index) => <article className="produce-row" key={`${item.farmer}-${item.type}-${index}`}><span className="produce-icon icon-green"><Wheat size={17} /></span><span className="produce-main"><strong>{item.type}</strong><small>{item.farmer} · {item.farm}</small></span><span className="produce-quantity"><strong>{item.quantity} {item.unit}</strong><small>{item.district} district</small></span><span className="sample-chip">EXAMPLE LISTING</span></article>)}{products.filter((item) => item.type === 'Vegetables').length === 0 && <div className="empty-state"><ShoppingBag size={22} /><strong>No produce listed yet</strong><span>Share vegetables with the group.</span></div>}</div></PageCard>}
    {tab === 'Announcements' && <PageCard className="announcement-card"><div className="section-heading"><div><p className="eyebrow">FROM YOUR CO-OP ADMINISTRATORS</p><h2>Community noticeboard</h2></div><button className="button button-outline button-small" onClick={onAnnounce}><Plus size={15} /> Add announcement</button></div>{activities.map((x, i) => <div className="notice-row" key={`${x.title}-${i}`}><div><span className="eyebrow">{x.time}</span><h3>{x.title}</h3><p>{x.detail}</p></div><ChevronRight size={17} /></div>)}</PageCard>}
    {tab === 'Opportunities' && <>
      <div className="opportunity-grid">{[['Seedling exchange', 'Example opportunity · ask your cooperative to confirm dates', 'Vegetables', Sprout], ['Growers meeting', 'Example opportunity · ask your cooperative to confirm dates', 'Community', Users]].map(([title, detail, tag, Icon]) => <PageCard className="opportunity-card" key={title}><span className="opportunity-icon"><Icon size={18} /></span><span className="opportunity-tag">{tag}</span><h3>{title}</h3><p>{detail}</p><button className="text-link" onClick={() => setNotice('This is a demonstration opportunity. Ask your local cooperative to confirm current dates and availability.')}>Ask about this <ArrowRight size={14} /></button></PageCard>)}</div>
      <section className="sharing-section"><div className="sharing-heading"><span className="sharing-heading-icon"><Tractor size={19} /></span><div><p className="eyebrow">SHARE TO GROW</p><h2>Borrow &amp; share equipment</h2><p>Connect with neighbours to make tools and transport go further.</p></div></div><div className="sharing-grid">{[['Ox-drawn plough', 'Available to borrow', 'Example listing · Berea', Tractor], ['Farm trailer', 'Available to share', 'Example listing · Maseru', ShoppingBag], ['Water tank', 'Looking to borrow', 'Example listing · Leribe', Droplets]].map(([name, status, location, Icon]) => <article className="sharing-card" key={name}><span className="sharing-card-image"><Icon size={31} strokeWidth={1.4} /></span><span className="sharing-status">{status}</span><h3>{name}</h3><p>{location}</p><button className="button button-outline button-small" onClick={() => setNotice('This is a sample listing. No booking or message was sent; contact your cooperative to arrange equipment sharing.')}>View details <ArrowRight size={14} /></button></article>)}</div><p className="sharing-disclaimer"><ShieldCheck size={14} /> Demonstration listings only · availability and contact details are not connected.</p></section>
    </>}
    <SdgStrip />
    <SdgImpact />
  </TranslateContent>
}

function SeasonalGuide() {
  const month = new Date().toLocaleDateString('en', { month: 'long' })
  const rainySeason = [9, 10, 11, 0, 1, 2].includes(new Date().getMonth())
  const crops = [
    { name: 'Maize', icon: Wheat, sow: 'Oct – Dec', harvest: 'Mar – May', note: rainySeason ? 'Check soil moisture and plant after dependable early rains.' : 'Prepare seed and storage for the next planting window.' },
    { name: 'Beans', icon: Sprout, sow: 'Nov – Jan', harvest: 'Feb – Apr', note: 'Use clean seed and avoid waterlogged ground.' },
    { name: 'Potatoes', icon: CircleDot, sow: 'Sep – Feb', harvest: 'Dec – May', note: 'Earth up plants as they grow and protect from frost.' },
    { name: 'Cabbage', icon: Leaf, sow: 'Feb – May', harvest: 'May – Sep', note: 'Choose a cool-season planting window and water consistently.' },
  ]
  return <TranslateContent><section className="seasonal-guide"><div className="seasonal-guide-heading"><span className="seasonal-guide-icon"><CalendarDays size={20} /></span><div><p className="eyebrow">SEASONAL CROP GUIDE · LESOTHO</p><h2>What to grow, and when</h2><p>A practical planning calendar for the current month: <strong>{month}</strong>.</p></div><span className="seasonal-season-pill">{rainySeason ? 'Rainy season' : 'Cooler, drier season'}</span></div><div className="crop-calendar">{crops.map(({ name, icon: Icon, sow, harvest, note }) => <article className="crop-calendar-card" key={name}><span className="crop-calendar-icon"><Icon size={18} /></span><h3>{name}</h3><div className="crop-calendar-dates"><span><small>SOW</small><strong>{sow}</strong></span><span><small>HARVEST</small><strong>{harvest}</strong></span></div><p>{note}</p></article>)}</div><p className="seasonal-guide-note"><Info size={14} /> General seasonal guidance only. Timing varies by altitude, district, local weather and variety; ask your local extension officer before planting.</p></section></TranslateContent>
}

function ResourcesPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('Everything')
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useStoredState('saved-resources', [])
  const cats = ['Everything', 'Vegetables', 'Climate smart']
  const visible = resources.filter((r) => (category === 'Everything' || r.category.toLowerCase().includes(category.toLowerCase().split(' ')[0])) && `${r.title} ${r.detail}`.toLowerCase().includes(search.toLowerCase()))
  return <TranslateContent>
    <PageIntro eyebrow="KNOWLEDGE FOR EVERY SEASON" title="A little know-how goes a long way." description="Practical, easy-to-follow ideas from the farming community, made for growing in Lesotho." />
    <SeasonalGuide />
    <div className="resource-feature"><div className="feature-illustration"><span className="feature-sun" /><span className="feature-mountain" /><span className="feature-plant"><Sprout size={68} strokeWidth={1} /></span><span className="feature-ground" /></div><div className="resource-feature-copy"><span className="feature-label"><Sparkles size={13} /> THIS SEASON’S PICK</span><h2>Plant with the rain,<br />not against it.</h2><p>A few small changes to how you plan and water can make a real difference to your next harvest.</p><button className="button button-dark" onClick={() => document.getElementById('resource-grid')?.scrollIntoView({ behavior: 'smooth' })}>Explore the guide <ArrowRight size={15} /></button></div></div>
    <div className="resource-toolbar"><div><p className="eyebrow">THE COMMUNITY KNOW-HOW LIBRARY</p><h2>Learn, grow, share.</h2></div><label className="search-field resource-search"><Search size={15} /><input placeholder="Find a topic…" value={search} onChange={(e) => setSearch(e.target.value)} /></label></div>
    <div className="resource-filters">{cats.map((c) => <button key={c} className={category === c ? 'filter-active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>
    <div id="resource-grid" className="resource-grid">{visible.map((r) => { const isSaved = saved.includes(r.title); return <article className="resource-card" key={r.title}><div className={`resource-icon-wrap resource-photo icon-${r.color}`}><img src={`https://images.unsplash.com/${r.image}?auto=format&fit=crop&w=160&h=120&q=80`} alt={r.title} loading="lazy" /></div><span className="resource-category">{r.category}</span><h3>{r.title}</h3><p>{r.detail}</p><div className="resource-card-foot"><span><BookOpen size={13} /> {r.time}</span><button className={`save-resource ${isSaved ? 'saved' : ''}`} aria-label={isSaved ? 'Remove saved resource' : 'Save resource'} onClick={() => setSaved((prev) => isSaved ? prev.filter((x) => x !== r.title) : [...prev, r.title])}>{isSaved ? <><Check size={13} /> Saved</> : <><Plus size={13} /> Save</>}</button></div></article> })}{visible.length === 0 && <div className="empty-state"><Search size={22} /><strong>No guides found</strong><span>Try a different search or category.</span></div>}</div>
    <div className="resource-contribute"><span className="contribute-icon"><Users size={19} /></span><span><strong>Have a tip that works on your farm?</strong><small>Great local knowledge deserves to be shared. Talk to your cooperative about contributing.</small></span><button className="text-link" onClick={() => navigate('/cooperative')}>Get involved <ArrowRight size={14} /></button></div>
  </TranslateContent>
}

function AdminPage({ setNotice, onAnnounce }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    let active = true
    apiRequest('/api/admin/users')
      .then((result) => { if (active) setUsers(result.users) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [refresh])
  const toggleAccess = async (user) => {
    const action = user.disabled ? 'restore' : 'suspend'
    if (!window.confirm(`${action[0].toUpperCase()}${action.slice(1)} access for ${user.name} (${user.email})?`)) return
    try {
      await apiRequest('/api/admin/users', { method: 'PATCH', body: { id: user.id, disabled: !user.disabled } })
      setUsers((current) => current.map((item) => item.id === user.id ? { ...item, disabled: !user.disabled } : item))
      setNotice(`Account access ${user.disabled ? 'restored' : 'suspended'}`)
    } catch (requestError) {
      setError(requestError.message)
    }
  }
  const farmers = users.filter((user) => user.role !== 'admin').length
  const administrators = users.filter((user) => user.role === 'admin').length
  const suspended = users.filter((user) => user.disabled).length
  return <TranslateContent>
    <PageIntro eyebrow="COOPERATIVE ADMINISTRATION" title="Manage the people who grow together." description="Review registered accounts, publish cooperative announcements, and help members keep their records up to date." />
    <div className="admin-quick-actions"><div><ShieldCheck size={18} /><span><strong>Administrator account</strong><small>Protected admin actions are recorded on the server.</small></span></div><button className="button button-outline" onClick={() => setRefresh((value) => value + 1)}><Activity size={14} /> Refresh accounts</button></div>
    <div className="admin-summary-grid"><StatCard label="Registered farmers" value={loading ? '—' : farmers.toString()} note="Community accounts" icon={Users} color="green" /><StatCard label="Co-op administrators" value={loading ? '—' : administrators.toString()} note="Protected accounts" icon={ShieldCheck} color="purple" /><StatCard label="Total members" value={loading ? '—' : users.length.toString()} note="All account roles" icon={Activity} color="orange" /><StatCard label="Suspended" value={loading ? '—' : suspended.toString()} note="Accounts with access paused" icon={LockKeyhole} color="green" /></div>
    <PageCard className="table-card admin-table-card"><div className="table-top"><div><p className="eyebrow">REGISTERED AGRIVISION ACCOUNTS</p><h2>Farmers &amp; administrators <span className="count-chip">{users.length}</span></h2></div><button className="button button-dark button-small" onClick={onAnnounce}><Plus size={14} /> New announcement</button></div>{error && <div className="api-error-banner"><ShieldCheck size={16} /><span>{error}</span></div>}{loading ? <div className="empty-state"><Activity size={22} /><strong>Loading accounts…</strong></div> : <div className="table-scroll"><table className="data-table"><thead><tr><th>ACCOUNT</th><th>EMAIL</th><th>FARM</th><th>DISTRICT</th><th>ROLE</th><th>ACCESS</th><th>ACTION</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><strong>{user.name}</strong></td><td>{user.email}</td><td>{user.farm}</td><td>{user.district}</td><td><span className="health-pill health-good">{user.role}</span></td><td>{user.disabled ? 'Suspended' : 'Active'}</td><td>{user.role !== 'admin' && <button className="button button-outline button-small" onClick={() => toggleAccess(user)}>{user.disabled ? 'Restore' : 'Suspend'}</button>}</td></tr>)}</tbody></table>{users.length === 0 && <div className="empty-state"><Users size={22} /><strong>No accounts yet</strong></div>}</div>}</PageCard>
    <PageCard className="admin-note"><span className="account-info-icon"><LockKeyhole size={18} /></span><div><h3>Role-based access</h3><p>Farmers can manage their own animal records and produce listings. Administrators can publish announcements and suspend farmer accounts. Passwords are never shown to administrators.</p></div></PageCard>
  </TranslateContent>
}

function ProfilePage({ profile, session, onSave, onSignOut }) {
  const [form, setForm] = useState(profile)
  useEffect(() => { setForm(profile) }, [profile])
  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  return <TranslateContent>
    <PageIntro eyebrow="YOUR ACCOUNT" title="A home for your farm." description="Keep your contact and farm details up to date so your cooperative can keep you in the loop." />
    <PageCard className="profile-card"><div className="profile-cover"><div className="profile-cover-pattern" /><span className="profile-large-avatar">{profile.name.slice(0, 1)}</span></div><div className="profile-details"><div className="profile-name-row"><div><h2>{profile.name}</h2><span className="verified-tag"><BadgeCheck size={14} /> {session.role === 'admin' ? 'Cooperative administrator' : 'Farmer account'}</span></div><span className="profile-since">{profile.email}</span></div><form className="profile-form" onSubmit={(e) => { e.preventDefault(); onSave(form).catch((error) => window.alert(`Could not save your profile: ${error.message}`)) }}><label className="form-field"><span>YOUR NAME</span><input name="name" value={form.name} onChange={change} required /></label><label className="form-field"><span>FARM NAME</span><input name="farm" value={form.farm} onChange={change} required /></label><label className="form-field"><span>YOUR DISTRICT</span><select name="district" value={form.district} onChange={change}>{districts.map((d) => <option key={d}>{d}</option>)}</select></label><label className="form-field"><span>PHONE NUMBER <small>OPTIONAL</small></span><input name="phone" type="tel" placeholder="+266" value={form.phone} onChange={change} /></label><div className="form-actions"><span><LockKeyhole size={13} /> Details are stored in your AgriVision account.</span><button className="button button-dark" type="submit"><Check size={15} /> Save changes</button></div></form></div></PageCard>
    <PageCard className="account-info"><span className="account-info-icon"><ShieldCheck size={19} /></span><div><h3>Secure {session.role === 'admin' ? 'administrator' : 'farmer'} account</h3><p>Your password is one-way hashed. This session uses a secure, HTTP-only cookie and expires after 8 hours.</p></div><button className="button button-outline" onClick={onSignOut}><LogOut size={14} /> Sign out</button></PageCard>
  </TranslateContent>
}

function SettingsPage({ setNotice }) {
  const [prefs, setPrefs] = useStoredState('preferences', { weather: true, prices: false, cooperative: true, email: false })
  const toggles = [['weather', 'Weather reminders', 'A heads-up about the forecast in your district', CloudSun], ['prices', 'Market price changes', 'Know when local prices shift', TrendingUp], ['cooperative', 'Cooperative updates', 'Meetings, opportunities and announcements', Users], ['email', 'Email updates', 'An occasional note to your inbox', Mail]]
  return <TranslateContent>
    <PageIntro eyebrow="MAKE IT YOURS" title="The details, just right." description="A few simple preferences help keep AgriVision useful for you and your farm." />
    <PageCard className="settings-card"><div className="section-heading"><div><p className="eyebrow">YOUR NOTIFICATIONS</p><h2>Choose what you hear about.</h2></div><Bell size={20} className="settings-bell" /></div><div className="settings-list">{toggles.map(([key, title, detail, Icon]) => <label className="setting-row" key={key}><span className={`setting-icon setting-${key}`}><Icon size={17} /></span><span className="setting-copy"><strong>{title}</strong><small>{detail}</small></span><input type="checkbox" checked={prefs[key]} onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))} /><span className="toggle-switch" /></label>)}</div><div className="settings-footer"><span><LockKeyhole size={13} /> Notification display preferences are saved on this device.</span><button className="button button-outline" onClick={() => setNotice('Your preferences are saved.')}>Done <Check size={15} /></button></div></PageCard>
    <PageCard className="settings-data"><div className="settings-data-head"><span className="settings-data-icon"><ShieldCheck size={19} /></span><span><h3>Your data belongs to you.</h3><p>Farm records are stored in your AgriVision account database. Notification display preferences and saved learning guides stay in this browser.</p></span></div><button className="button button-outline" onClick={() => { if (window.confirm('Clear saved preferences and guide bookmarks from this browser? Your account and farm records will not be deleted.')) { Object.keys(localStorage).filter((k) => k.startsWith('agriconnect-')).forEach((k) => localStorage.removeItem(k)); window.location.reload() } }}>Clear local preferences <X size={15} /></button></PageCard>
  </TranslateContent>
}

function Modal({ type, onClose, onActivity, onProduct }) {
  const isProduce = type === 'produce'
  const title = isProduce ? 'Share produce with your co-op' : 'Share with your community'
  const [form, setForm] = useState(isProduce ? { type: 'Vegetables', quantity: '', unit: 'kg' } : { title: '', detail: '' })
  const [error, setError] = useState('')
  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    try {
      if (isProduce) await onProduct(form)
      else await onActivity(form)
    } catch (requestError) {
      setError(requestError.message)
    }
  }
  const field = (name, label, placeholder = '', opts = {}) => <label className="form-field" key={name}><span>{label}</span>{opts.options ? <select name={name} value={form[name]} onChange={update}>{opts.options.map((o) => <option key={o}>{o}</option>)}</select> : <input name={name} type={opts.type || 'text'} placeholder={placeholder} value={form[name]} onChange={update} required={opts.required !== false} />}</label>
  return <TranslateContent><div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-heading"><div className="modal-head"><span className="modal-mark">{isProduce ? <ShoppingBag size={18} /> : <Bell size={18} />}</span><button className="modal-close" onClick={onClose} aria-label="Close"><X size={19} /></button></div><h2 id="modal-heading">{title}</h2><p className="modal-subtitle">{isProduce ? 'Add a listing to your cooperative.' : 'Share an opportunity with your co-op neighbours.'}</p><form className="modal-form" onSubmit={submit}>{isProduce ? <>{field('type', 'PRODUCE TYPE', '', { options: ['Vegetables'] })}{field('quantity', 'QUANTITY', 'e.g. 80', { type: 'number' })}{field('unit', 'UNIT', '', { options: ['kg', 'crates', 'bales'] })}</> : <>{field('title', 'ANNOUNCEMENT', 'e.g. Community meeting')}{field('detail', 'DETAILS', 'Where, when, or anything else farmers should know…')}</>}<div className="modal-data-note"><LockKeyhole size={13} /> Saved to your AgriVision account.</div>{error && <p className="form-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="button button-outline" onClick={onClose}>Cancel</button><button type="submit" className="button button-dark">{isProduce ? 'Share produce' : 'Share announcement'} <ArrowRight size={15} /></button></div></form></section></div></TranslateContent>
}

function WelcomePage({ navigate, onSignIn }) {
  const t = useTranslate()
  const language = useContext(LocaleContext)
  const [district, setDistrict] = useState('Maseru')
  const { weather } = useDistrictWeather(district)
  const alerts = buildAlerts(weather, language)
  const [story, setStory] = useState(null)
  const [priced, setPriced] = useState(null)
  useEffect(() => {
    apiRequest('/api/stories').then((result) => setStory(result.stories[0] || null)).catch(() => {})
    apiRequest('/api/crops').then((result) => setPriced(result.crops.filter((crop) => crop.status === 'Price available').length)).catch(() => {})
  }, [])
  const current = weather?.current
  const description = current ? weatherDescription(current.weather_code) : null
  const WeatherIcon = description?.Icon || CloudSun
  return <TranslateContent>
    <section className="welcome-hero">
      <p className="eyebrow">{t('WELCOME TO AGRIVISION LESOTHO')}</p>
      <h1>{t('Growing together, farming smarter.')}</h1>
      <p>{t('Free weather, rain alerts, crop prices and farming advice for everyone. Create a free farmer account to share produce and join the cooperative.')}</p>
      <div className="welcome-buttons"><button className="button button-dark" onClick={onSignIn}>{t('Create a farmer account')} <ArrowRight size={15} /></button><button className="button button-outline" onClick={() => navigate('/crops')}>{t('See crop prices')}</button></div>
    </section>
    <div className="welcome-grid">
      <PageCard className="welcome-card">
        <p className="eyebrow">{t('WEATHER NOW')}</p>
        <div className="welcome-weather"><WeatherIcon size={34} /><div><strong>{current ? `${Math.round(current.temperature_2m)}°C` : '—'}</strong><span>{description?.condition || 'Loading…'}</span></div></div>
        <label className="field-label">{t('YOUR DISTRICT')}<select value={district} onChange={(e) => setDistrict(e.target.value)}>{districts.map((d) => <option key={d}>{d}</option>)}</select></label>
        <button className="welcome-link" onClick={() => navigate('/weather')}>7-day forecast →</button>
      </PageCard>
      <PageCard className="welcome-card">
        <p className="eyebrow">{t('RAIN ALERTS')}</p>
        <h3>{!weather ? 'Checking…' : alerts.length ? `${alerts.length} alert${alerts.length > 1 ? 's' : ''} for ${district}` : `No alerts for ${district}`}</h3>
        <p className="body-description">{alerts[0] ? alerts[0].text : 'Heavy rain, hail, frost and dry-spell warnings from the live forecast.'}</p>
        <button className="welcome-link" onClick={() => navigate('/alerts')}>How to protect your farm →</button>
      </PageCard>
      <PageCard className="welcome-card">
        <p className="eyebrow">{t('CROP PRICES')}</p>
        <h3>{priced === null ? 'Crops and prices' : priced > 0 ? `${priced} crops with prices` : 'Prices coming soon'}</h3>
        <p className="body-description">Prices researched by our administrator, with photos of every crop.</p>
        <button className="welcome-link" onClick={() => navigate('/crops')}>Browse crops →</button>
      </PageCard>
      <PageCard className="welcome-card">
        <p className="eyebrow">{t('FARMING RESOURCES')}</p>
        <h3>{t('Practical farming guides')}</h3>
        <p className="body-description">{t('Find ideas for planting, soil care and growing vegetables.')}</p>
        <button className="welcome-link" onClick={() => navigate('/resources')}>{t('Explore the guide')} →</button>
      </PageCard>
    </div>
    {story && <PageCard className="welcome-story">
      {story.imageIds[0] && <img src={`/api/stories/images/${story.imageIds[0]}`} alt={story.title} />}
      <div><p className="eyebrow">LATEST SUCCESS STORY</p><h3>{story.title}</h3><p className="body-description">{story.body.length > 200 ? `${story.body.slice(0, 200)}…` : story.body}</p><button className="welcome-link" onClick={() => navigate('/stories')}>Read the stories →</button></div>
    </PageCard>}
    <PageCard className="welcome-join">
      <h3>{t('With a free account you can')}</h3>
      <ul><li>{t('Join the cooperative and read its announcements.')}</li><li>{t('List your produce for other farmers and buyers.')}</li></ul>
      <button className="button button-dark" onClick={onSignIn}>{t('Sign in or create an account')} <ArrowRight size={15} /></button>
    </PageCard>
  </TranslateContent>
}

const HAZARDS = [
  { id: 'rain', title: 'Heavy rain and flooding', intro: 'Too much water at once washes away seed and soil, and drowns roots.', tips: [
    { art: 'trench', do: 'Dig a drainage trench along the uphill edge of the field.', example: 'A ditch about 30 cm deep above your crops sends runoff around them instead of through them.' },
    { art: 'ridge', do: 'Plant on raised beds or ridges so roots stay above standing water.', example: 'Cabbages planted on ridges about 20 cm high, with water running off in the furrows between.' },
    { art: null, do: 'Harvest ripe produce early and keep stored grain covered and off the floor.', example: 'Cut mature vegetables before the storm, and stack grain bags on pallets or stones under a roof.' },
  ] },
  { id: 'hail', title: 'Hail and strong wind', intro: 'Hail shreds leaves and fruit in minutes. Wind can flatten tall crops.', tips: [
    { art: 'net', do: 'Cover high-value vegetables with hail net or shade cloth.', example: 'A net held on poles over tomato rows protects the plants and lets light and rain through.' },
    { art: null, do: 'Stake tall crops such as tomatoes, and earth up maize.', example: 'Tie each tomato plant to a stake with soft string, loosely enough that the stem can grow.' },
    { art: null, do: 'Plant a windbreak of trees or tall grass along the exposed edge.', example: 'A row of trees on the windy side slows the wind across the whole field.' },
  ] },
  { id: 'frost', title: 'Frost', intro: 'Frost can kill seedlings and flowers overnight, especially in the highlands.', tips: [
    { art: 'cover', do: 'Cover seedlings in the evening and take the cover off in the morning.', example: 'Old sacks, plastic sheets or straw over bean seedlings, lifted off on sticks so they do not touch the leaves.' },
    { art: null, do: 'Water the soil in the afternoon before a frost night.', example: 'Moist soil holds more heat than dry soil, so the air near the plants stays slightly warmer.' },
    { art: null, do: 'Delay planting tender crops until the last frost has passed.', example: 'Start tomatoes and beans late in spring, and use frost-hardy crops such as cabbage or spinach early.' },
  ] },
  { id: 'drought', title: 'Dry spells and drought', intro: 'Without rain, young crops wilt and yields fall.', tips: [
    { art: 'mulch', do: 'Mulch around plants to keep moisture in the soil.', example: 'A thick layer of dry grass or straw around each plant slows evaporation and keeps weeds down.' },
    { art: 'mulch', do: 'Dig planting basins (likoti) that catch rain right at the plant.', example: 'Small pits, spaced along the row, collect water and let it sink in beside the roots.' },
    { art: null, do: 'Choose drought-tolerant crops and plant at the start of the rains.', example: 'Sorghum and some beans cope with dry weather better than maize on poor soil.' },
  ] },
  { id: 'erosion', title: 'Soil erosion on slopes', intro: 'Heavy rain on bare slopes carries away the best topsoil.', tips: [
    { art: 'terrace', do: 'Plough and plant along the contour, and build stone terraces on steep land.', example: 'Rows that follow the slope across, not up and down, with stone or grass strips every few metres to slow the water.' },
    { art: null, do: 'Keep the soil covered with crops, residue or mulch.', example: 'Leave maize stalks on the field after harvest instead of burning them.' },
  ] },
]

function HazardArt({ kind }) {
  const ground = '#8a6a4a'; const dark = '#5a3d28'; const leaf = '#5f9a4f'; const water = '#7fb4d8'
  const plants = (xs, y) => xs.map((x) => <g key={x}><line x1={x} y1={y} x2={x} y2={y + 9} stroke={leaf} strokeWidth="2" /><circle cx={x} cy={y - 2} r="6" fill={leaf} /></g>)
  const art = {
    trench: <><path d="M30 8l-5 14M62 4l-5 14M94 8l-5 14" stroke={water} strokeWidth="2" strokeLinecap="round" /><polygon points="0,72 240,108 240,140 0,140" fill={ground} /><polygon points="64,82 100,92 100,102 64,92" fill={dark} /><path d="M58 70 Q84 74 106 100" stroke={water} strokeWidth="2.5" fill="none" strokeDasharray="5 4" />{plants([150, 182, 214], 98)}</>,
    ridge: <><path d="M0 92 Q20 70 40 92 T80 92 T120 92 T160 92 T200 92 T240 92 V140 H0Z" fill={ground} />{plants([20, 100, 180], 74)}{[60, 140, 220].map((x) => <ellipse key={x} cx={x} cy="93" rx="12" ry="3" fill={water} />)}</>,
    net: <><rect y="112" width="240" height="28" fill={ground} />{[40, 120, 200].map((x) => <line key={x} x1={x} y1="36" x2={x} y2="112" stroke={dark} strokeWidth="3" />)}<path d="M40 36 H200" stroke="#455145" strokeWidth="2" /><path d="M40 36 H200 M40 44 H200" stroke="#455145" strokeWidth="1" strokeDasharray="3 3" />{plants([60, 90, 120, 150, 180], 104)}{[[70, 10], [110, 16], [150, 8], [180, 18], [90, 24]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.5" fill="#fff" stroke="#9aa89a" />)}</>,
    cover: <><rect y="112" width="240" height="28" fill={ground} /><path d="M30 112 Q60 60 90 112 Q120 60 150 112 Q180 60 210 112" fill="rgba(255,255,255,.7)" stroke="#455145" strokeWidth="1.5" /><circle cx="205" cy="26" r="12" fill="#f4e7a8" /></>,
    mulch: <><path d="M26 10l-5 14M58 6l-5 14M90 10l-5 14" stroke={water} strokeWidth="2" strokeLinecap="round" /><rect y="96" width="240" height="44" fill={ground} /><path d="M70 96 Q120 134 170 96" fill={dark} /><line x1="120" y1="80" x2="120" y2="112" stroke={leaf} strokeWidth="3" /><circle cx="120" cy="76" r="9" fill={leaf} />{[40, 52, 64, 176, 190, 204].map((x) => <line key={x} x1={x} y1="94" x2={x + 8} y2="91" stroke="#d9b64a" strokeWidth="3" strokeLinecap="round" />)}</>,
    terrace: <><polygon points="0,50 70,50 70,80 140,80 140,110 240,110 240,140 0,140" fill={ground} /><rect x="0" y="46" width="70" height="5" fill={leaf} /><rect x="70" y="76" width="70" height="5" fill={leaf} /><rect x="140" y="106" width="100" height="5" fill={leaf} /><path d="M70 50 V80 M140 80 V110" stroke="#c9c1b0" strokeWidth="4" /></>,
  }[kind]
  return <svg className="hazard-art" viewBox="0 0 240 140" role="img" aria-label="Illustration of the protection example"><rect width="240" height="140" fill="#eaf3f8" />{art}</svg>
}

function buildAlerts(weather, language) {
  const d = weather?.daily
  if (!d?.time) return []
  const out = []
  d.time.forEach((date, i) => {
    const day = i === 0 ? 'Today' : new Date(`${date}T12:00:00`).toLocaleDateString(language === 'st' ? 'st-LS' : 'en', { weekday: 'long', day: 'numeric', month: 'short' })
    const rain = d.precipitation_sum?.[i] ?? 0
    const gust = d.wind_gusts_10m_max?.[i] ?? 0
    const low = d.temperature_2m_min?.[i]
    if (rain >= 40) out.push({ day, hazard: 'rain', level: 'warning', text: `Very heavy rain likely: about ${Math.round(rain)} mm.` })
    else if (rain >= 20) out.push({ day, hazard: 'rain', level: 'watch', text: `Heavy rain possible: about ${Math.round(rain)} mm.` })
    if ([96, 99].includes(d.weather_code?.[i])) out.push({ day, hazard: 'hail', level: 'warning', text: 'Thunderstorm with hail possible.' })
    if (gust >= 60) out.push({ day, hazard: 'hail', level: gust >= 80 ? 'warning' : 'watch', text: `Strong wind gusts up to ${Math.round(gust)} km/h.` })
    if (typeof low === 'number' && low <= 2) out.push({ day, hazard: 'frost', level: low <= 0 ? 'warning' : 'watch', text: `${low <= 0 ? 'Frost likely' : 'Frost possible'}: low of ${Math.round(low)}°C.` })
  })
  const total = (d.precipitation_sum || []).reduce((sum, value) => sum + (value || 0), 0)
  if (d.precipitation_sum && total < 5) out.push({ day: 'This week', hazard: 'drought', level: 'watch', text: `Very little rain expected: about ${Math.round(total)} mm in 7 days.` })
  return out
}

function AlertsPage({ initialDistrict }) {
  const t = useTranslate()
  const language = useContext(LocaleContext)
  const [district, setDistrict] = useState(initialDistrict)
  const { weather, error, loading } = useDistrictWeather(district)
  const alerts = buildAlerts(weather, language)
  const active = new Set(alerts.map((alert) => alert.hazard))
  return <TranslateContent>
    <PageIntro eyebrow="RAIN ALERTS & PROTECTION" title="Be ready before the weather turns." description="Warnings are worked out from the live 7-day forecast for your district, with simple ways to protect your crops and farm." />
    <div className="weather-controls"><label className="field-label">YOUR DISTRICT<select value={district} onChange={(e) => setDistrict(e.target.value)}>{districts.map((d) => <option key={d}>{d}</option>)}</select></label></div>
    {error && <div className="api-error-banner" role="status"><CloudRain size={17} /><span>Live forecast could not be loaded: {error}</span></div>}
    {loading && <p className="story-meta">Checking the forecast for {district}…</p>}
    {weather && alerts.length === 0 && <PageCard className="alert-clear"><CheckCircle2 size={22} /><div><h3>No weather alerts for {district}</h3><p>Nothing serious is forecast in the next 7 days. Check again each morning.</p></div></PageCard>}
    {alerts.length > 0 && <div className="alert-list" role="list">{alerts.map((alert, index) => <a key={index} role="listitem" href={`#hazard-${alert.hazard}`} className={`alert-item alert-${alert.level}`}><strong>{t(alert.level === 'warning' ? 'WARNING' : 'WATCH')} · {t(alert.day)}</strong><span>{t(alert.text)}</span><small>{t('See what to do')} →</small></a>)}</div>}
    <p className="disclaimer"><ShieldCheck size={14} /> These alerts come from a forecast and simple rain, wind and temperature limits. They are a guide, not an official warning. Also follow Lesotho Meteorological Services.</p>
    <h2 className="guide-section-title">How to protect your farm</h2>
    <div className="hazard-list">{HAZARDS.map((hazard) => (
      <section id={`hazard-${hazard.id}`} key={hazard.id} className={`panel page-card hazard-card ${active.has(hazard.id) ? 'hazard-active' : ''}`}>
        <h3>{hazard.title}{active.has(hazard.id) && <span className="hazard-flag">Alert now</span>}</h3>
        <p className="body-description">{hazard.intro}</p>
        {hazard.tips.map((tip) => <div className="hazard-tip" key={tip.do}><div><strong>{tip.do}</strong><p className="story-text"><em>Example:</em> {tip.example}</p></div>{tip.art && <HazardArt kind={tip.art} />}</div>)}
      </section>
    ))}</div>
    <p className="crop-credit">General guidance. Please confirm details with a local agriculture or extension officer.</p>
  </TranslateContent>
}

const CROP_STATUSES = ['Not yet researched', 'Price available', 'Not yet available in Lesotho']
const CROP_UNITS = ['kg', '10 kg bag', '50 kg bag', 'crate', 'bunch', 'head', 'each']

function CropPhoto({ crop }) {
  const t = useTranslate()
  const [src, setSrc] = useState(crop.imageUrl || '')
  useEffect(() => {
    if (crop.imageUrl) { setSrc(crop.imageUrl); return undefined }
    let cancelled = false
    const readCache = () => { try { return JSON.parse(localStorage.getItem('agrivision-crop-photos') || '{}') } catch { return {} } }
    const cached = readCache()[crop.wiki]
    if (cached) { setSrc(cached); return undefined }
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(crop.wiki)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no photo'))))
      .then((data) => {
        const url = data.thumbnail?.source
        if (!url || cancelled) return
        setSrc(url)
        try { localStorage.setItem('agrivision-crop-photos', JSON.stringify({ ...readCache(), [crop.wiki]: url })) } catch { /* storage unavailable */ }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [crop.imageUrl, crop.wiki])
  return src ? <img src={src} alt={t(crop.name)} loading="lazy" onError={() => setSrc('')} /> : <span className="crop-fallback"><Sprout size={30} /></span>
}

function CropsPage({ session, setNotice }) {
  const t = useTranslate()
  const language = useContext(LocaleContext)
  const isAdmin = session?.role === 'admin'
  const [crops, setCrops] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [editing, setEditing] = useState(null)
  const load = () => apiRequest('/api/crops').then((result) => { setCrops(result.crops); setError('') }).catch((e) => setError(e.message))
  useEffect(() => { load() }, [])
  const categories = ['All', ...new Set((crops || []).map((crop) => crop.category))]
  const visible = (crops || []).filter((crop) => (category === 'All' || crop.category === category) && crop.name.toLowerCase().includes(query.trim().toLowerCase()))
  const priceLine = (crop) => crop.status === 'Price available' ? `M ${Number(crop.price).toFixed(2)} ${t('per')} ${t(crop.unit)}` : crop.status === 'Not yet available in Lesotho' ? t('Not yet available in our country') : t('Price not researched yet')
  const statusClass = { 'Price available': 'crop-ok', 'Not yet available in Lesotho': 'crop-na', 'Not yet researched': 'crop-wait' }
  return <TranslateContent>
    <PageIntro eyebrow="CROP PRICES" title="What our crops are worth." description="Prices are researched and updated by the cooperative administrator. Check the date on each card." action={isAdmin ? 'Add a crop' : undefined} onAction={() => setEditing({})} actionIcon={Plus} />
    {editing && isAdmin && <CropEditor key={editing.id || 'new'} crop={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }} setNotice={setNotice} />}
    <div className="crop-filters">
      <label className="crop-search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Search crops')} aria-label={t('Search crops')} /></label>
      <div className="crop-chips">{categories.map((name) => <button key={name} className={`crop-chip ${category === name ? 'crop-chip-on' : ''}`} onClick={() => setCategory(name)}>{t(name)}</button>)}</div>
    </div>
    {error && <p className="form-error">{error}</p>}
    {!crops && !error && <p className="story-meta">{t('Loading crops…')}</p>}
    {crops && visible.length === 0 && <PageCard><p className="story-text">{t('No crops match your search.')}</p></PageCard>}
    <div className="crop-grid">{visible.map((crop) => (
      <article key={crop.id} className={`crop-card ${statusClass[crop.status]}`}>
        <div className="crop-photo"><CropPhoto crop={crop} /></div>
        <div className="crop-body">
          <p className="crop-category">{t(crop.category)}</p>
          <h3>{t(crop.name)}</h3>
          <span className="crop-badge">{t(crop.status)}</span>
          <p className="crop-price">{priceLine(crop)}</p>
          {crop.note && <p className="crop-note">{t(crop.note)}</p>}
          {crop.updatedAt && <p className="crop-date">{t('Updated')} {new Date(crop.updatedAt).toLocaleDateString(language === 'st' ? 'st-LS' : 'en', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
          {isAdmin && <button className="button button-outline crop-edit" onClick={() => setEditing(crop)}><Pencil size={14} /> {t('Edit')}</button>}
        </div>
      </article>
    ))}</div>
    <p className="crop-credit">{t('Photos come from Wikipedia and Wikimedia Commons, or are added by the administrator.')}</p>
  </TranslateContent>
}

function CropEditor({ crop, onClose, onSaved, setNotice }) {
  const t = useTranslate()
  const isNew = !crop.id
  const [form, setForm] = useState({ name: crop.name || '', category: crop.category || 'Vegetables', status: crop.status || 'Not yet researched', price: crop.price ?? '', unit: crop.unit || 'kg', note: crop.note || '', imageUrl: crop.imageUrl || '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const update = (e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }))
  const save = async (e) => {
    e.preventDefault()
    if (isNew && form.name.trim().length < 2) return setError(t('Enter the crop name.'))
    if (form.status === 'Price available' && !(Number(form.price) >= 0 && String(form.price).trim() !== '')) return setError(t('Enter a price, or change the status.'))
    setBusy(true)
    setError('')
    try {
      await apiRequest(isNew ? '/api/crops' : `/api/crops/${crop.id}`, { method: isNew ? 'POST' : 'PUT', body: form })
      setNotice(t('Crop saved'))
      onSaved()
    } catch (saveError) { setError(saveError.message); setBusy(false) }
  }
  const remove = async () => {
    if (!window.confirm(`${t('Remove')} ${t(crop.name)} ${t('from the list?')}`)) return
    try { await apiRequest(`/api/crops/${crop.id}`, { method: 'DELETE' }); setNotice(t('Crop removed')); onSaved() } catch (removeError) { setError(removeError.message) }
  }
  return <PageCard className="story-editor"><form onSubmit={save} noValidate>
    <h2>{isNew ? t('Add a crop') : `${t('Edit')} ${t(crop.name)}`}</h2>
    {isNew && <><label className="form-field"><span>{t('CROP NAME')}</span><input name="name" value={form.name} onChange={update} maxLength={60} /></label><label className="form-field"><span>{t('CATEGORY')}</span><input name="category" value={form.category} onChange={update} maxLength={40} /></label></>}
    <label className="form-field"><span>{t('STATUS')}</span><select name="status" value={form.status} onChange={update}>{CROP_STATUSES.map((s) => <option key={s}>{t(s)}</option>)}</select></label>
    {form.status === 'Price available' && <><label className="form-field"><span>{t('PRICE (MALOTI)')}</span><input name="price" type="number" inputMode="decimal" min="0" step="0.01" value={form.price} onChange={update} /></label><label className="form-field"><span>{t('PER')}</span><select name="unit" value={form.unit} onChange={update}>{CROP_UNITS.map((u) => <option key={u}>{t(u)}</option>)}</select></label></>}
    <label className="form-field"><span>{t('NOTE (OPTIONAL)')}</span><textarea name="note" value={form.note} onChange={update} rows={3} maxLength={300} placeholder={t('e.g. Not yet available in our country, or where the price was researched')} /></label>
    <label className="form-field"><span>{t('PHOTO LINK (OPTIONAL)')}</span><input name="imageUrl" value={form.imageUrl} onChange={update} placeholder={t('https://…  (leave empty to use the automatic photo)')} /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="story-editor-actions">{!isNew && <button type="button" className="button button-outline" onClick={remove} disabled={busy}>{t('Remove crop')}</button>}<button type="button" className="button button-outline" onClick={onClose} disabled={busy}>{t('Cancel')}</button><button type="submit" className="button button-dark" disabled={busy}>{busy ? t('Saving…') : t('Save')}</button></div>
  </form></PageCard>
}

const MAX_STORY_IMAGES = 8

function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Choose a picture file.'))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, 1280 / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      let quality = 0.78
      let data = canvas.toDataURL('image/jpeg', quality)
      while (data.length > 450000 && quality > 0.4) { quality -= 0.1; data = canvas.toDataURL('image/jpeg', quality) }
      resolve(data)
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That picture could not be read.')) }
    img.src = url
  })
}

function StoriesPage({ session, setNotice }) {
  const isAdmin = session?.role === 'admin'
  const [stories, setStories] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [editing, setEditing] = useState(null)
  const load = () => apiRequest('/api/stories').then((result) => { setStories(result.stories); setLoadError('') }).catch((error) => setLoadError(error.message))
  useEffect(() => { load() }, [])
  const remove = async (story) => {
    if (!window.confirm(`Delete “${story.title}” and its pictures?`)) return
    try { await apiRequest(`/api/stories/${story.id}`, { method: 'DELETE' }); setNotice('Story deleted'); load() } catch (error) { setNotice(error.message) }
  }
  return <TranslateContent>
    <PageIntro eyebrow="SUCCESS STORIES" title="Farmers who are growing Lesotho." description="Stories from our cooperative and community." action={isAdmin ? 'Add a story' : undefined} onAction={() => setEditing({})} actionIcon={Plus} />
    {editing && isAdmin && <StoryEditor key={editing.id || 'new'} story={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }} setNotice={setNotice} />}
    {loadError && <p className="form-error">{loadError}</p>}
    {!stories && !loadError && <p className="story-meta">Loading stories…</p>}
    {stories?.length === 0 && <PageCard><p className="story-text">No stories yet. {isAdmin ? 'Use “Add a story” to publish the first one.' : 'Please check back soon.'}</p></PageCard>}
    <div className="story-list">{stories?.map((story) => (
      <PageCard key={story.id} className="story-card">
        <h2>{story.title}</h2>
        <p className="story-meta">{new Date(story.createdAt).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })} · {story.author}</p>
        {story.imageIds.length > 0 && <div className="story-gallery">{story.imageIds.map((id, index) => <a key={id} href={`/api/stories/images/${id}`} target="_blank" rel="noreferrer"><img loading="lazy" src={`/api/stories/images/${id}`} alt={`${story.title}, picture ${index + 1}`} /></a>)}</div>}
        <div className="story-text">{story.body.split('\n').filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        {isAdmin && <div className="story-actions"><button className="button button-outline" onClick={() => setEditing(story)}><Pencil size={15} /> Edit</button><button className="button button-outline" onClick={() => remove(story)}><Trash2 size={15} /> Delete</button></div>}
      </PageCard>
    ))}</div>
  </TranslateContent>
}

function StoryEditor({ story, onClose, onSaved, setNotice }) {
  const [title, setTitle] = useState(story.title || '')
  const [text, setText] = useState(story.body || '')
  const [existing, setExisting] = useState(story.imageIds || [])
  const [removed, setRemoved] = useState([])
  const [added, setAdded] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const total = existing.length + added.length
  const pick = async (e) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    setError('')
    if (total + files.length > MAX_STORY_IMAGES) { setError(`A story can have up to ${MAX_STORY_IMAGES} pictures.`); return }
    try { const prepared = await Promise.all(files.map(compressImage)); setAdded((current) => [...current, ...prepared]) } catch (pickError) { setError(pickError.message) }
  }
  const save = async (e) => {
    e.preventDefault()
    if (title.trim().length < 3) return setError('Give the story a title (at least 3 letters).')
    if (text.trim().length < 20) return setError('Write a few sentences (at least 20 characters).')
    setBusy(true)
    setError('')
    try {
      let id = story.id
      if (id) await apiRequest(`/api/stories/${id}`, { method: 'PUT', body: { title, body: text } })
      else id = (await apiRequest('/api/stories', { method: 'POST', body: { title, body: text } })).story.id
      for (const imageId of removed) await apiRequest(`/api/stories/images/${imageId}`, { method: 'DELETE' })
      for (const data of added) await apiRequest(`/api/stories/${id}/images`, { method: 'POST', body: { data } })
      setNotice('Story saved')
      onSaved()
    } catch (saveError) { setError(saveError.message); setBusy(false) }
  }
  return <TranslateContent><PageCard className="story-editor"><form onSubmit={save} noValidate>
    <h2>{story.id ? 'Edit story' : 'New story'}</h2>
    <label className="form-field"><span>TITLE</span><input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="A short, clear title" /></label>
    <label className="form-field"><span>STORY</span><textarea value={text} onChange={(e) => setText(e.target.value)} rows={9} maxLength={6000} placeholder="Tell the story…" /></label>
    <p className="field-hint">Pictures ({total} of {MAX_STORY_IMAGES})</p>
    <div className="story-gallery">
      {existing.map((id) => <span className="story-thumb" key={id}><img src={`/api/stories/images/${id}`} alt="Story picture" /><button type="button" aria-label="Remove picture" onClick={() => { setExisting(existing.filter((item) => item !== id)); setRemoved([...removed, id]) }}><X size={15} /></button></span>)}
      {added.map((data, index) => <span className="story-thumb" key={index}><img src={data} alt="New picture" /><button type="button" aria-label="Remove picture" onClick={() => setAdded(added.filter((_, i) => i !== index))}><X size={15} /></button></span>)}
    </div>
    {total < MAX_STORY_IMAGES && <label className="button button-outline story-add"><ImagePlus size={16} /> Add pictures<input type="file" accept="image/*" multiple hidden onChange={pick} /></label>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="story-editor-actions"><button type="button" className="button button-outline" onClick={onClose} disabled={busy}>Cancel</button><button type="submit" className="button button-dark" disabled={busy}>{busy ? 'Saving…' : 'Save story'}</button></div>
  </form></PageCard></TranslateContent>
}

function AuthModal({ onClose, onSession, onAdminSetup, onAudienceChange, audience, backendStatus }) {
  const t = useTranslate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', farm: '', district: 'Maseru', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const validate = (f) => {
    const found = {}
    if (mode === 'register') {
      if (f.name.trim().length < 2) found.name = 'Enter your full name (at least 2 letters).'
      if (f.farm.trim().length < 2) found.farm = 'Enter your farm or group name.'
    }
    const email = f.email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) found.email = 'Enter a valid email, like name@example.com.'
    else if ((mode === 'register' || audience === 'farmer') && !email.toLowerCase().endsWith('@gmail.com')) {
      found.email = 'Farmers must use a Gmail address ending in @gmail.com.'
    }
    if (!f.password) found.password = 'Enter your password.'
    else if (mode === 'register' && f.password.length < 12) found.password = `Use at least 12 characters (you have ${f.password.length}).`
    else if (mode === 'register' && !(/[A-Za-z]/.test(f.password) && /\d/.test(f.password))) found.password = 'Include letters and at least one number.'
    return found
  }
  const problems = validate(form)
  const shown = Object.fromEntries(Object.entries(problems).filter(([key]) => touched[key]))
  const blur = (e) => setTouched((current) => ({ ...current, [e.target.name]: true }))
  const update = (e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, farm: true, email: true, password: true })
    if (Object.keys(problems).length) { setError('Please fix the boxes marked in red.'); return }
    setBusy(true)
    setError('')
    try {
      const result = await apiRequest(mode === 'login' ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        body: mode === 'login'
          ? { email: form.email, password: form.password, audience }
          : { name: form.name, farm: form.farm, district: form.district, email: form.email, password: form.password },
      })
      onSession(result.user)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }
  return <TranslateContent><div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="modal auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-heading"><div className="modal-head"><span className="modal-mark">{audience === 'admin' ? <ShieldCheck size={18} /> : <LockKeyhole size={18} />}</span><button className="modal-close" onClick={onClose} aria-label={t('Close')}><X size={19} /></button></div><h2 id="auth-heading">{mode === 'login' ? audience === 'admin' ? t('Administrator sign in.') : t('Farmer sign in.') : t('Let’s grow something together.')}</h2><p className="modal-subtitle">{mode === 'login' ? audience === 'admin' ? t('Use your approved cooperative administrator email and password.') : t('Sign in with your farmer account, or create a free account.') : t('Create a farmer account to get started.')}</p>{backendStatus && (!backendStatus.databaseConfigured || backendStatus.databaseConnected === false || !backendStatus.authenticationConfigured) && <div className="auth-setup-notice" role="status"><ShieldCheck size={15} /><span>{backendStatus.databaseConnected === false ? t('Atlas is rejecting the database connection. Check the database username and password stored in Vercel; keep them private.') : t('Sign-in is temporarily unavailable until the production database is connected.')}</span></div>}<form className="modal-form auth-form" onSubmit={submit} noValidate>{mode === 'register' && <><label className="form-field auth-wide"><span>{t('YOUR NAME')}</span><input name="name" value={form.name} onChange={update} placeholder={t('Your full name')} maxLength={100} onBlur={blur} aria-invalid={Boolean(shown.name)} />{shown.name && <em className="field-error" role="alert">{t(shown.name)}</em>}</label><label className="form-field auth-wide"><span>{t('FARM NAME')}</span><input name="farm" value={form.farm} onChange={update} placeholder={t('Your farm or grower group')} maxLength={100} onBlur={blur} aria-invalid={Boolean(shown.farm)} />{shown.farm && <em className="field-error" role="alert">{t(shown.farm)}</em>}</label><label className="form-field auth-wide"><span>{t('YOUR DISTRICT')}</span><select name="district" value={form.district} onChange={update}>{districts.map((district) => <option key={district}>{district}</option>)}</select></label></>}<label className="form-field auth-wide"><span>{t('EMAIL ADDRESS')}</span><input name="email" type="email" value={form.email} onChange={update} placeholder={mode === 'register' || audience === 'farmer' ? t('name@gmail.com') : t('you@example.com')} autoComplete="email" inputMode="email" onBlur={blur} aria-invalid={Boolean(shown.email)} />{shown.email && <em className="field-error" role="alert">{t(shown.email)}</em>}</label><label className="form-field auth-wide"><span>{t('PASSWORD')}</span><span className="password-wrap"><input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={update} onBlur={blur} placeholder={t(mode === 'login' ? 'Your password' : 'At least 12 characters')} maxLength={128} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} aria-invalid={Boolean(shown.password)} /><button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label={t(showPassword ? 'Hide password' : 'Show password')}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span>{shown.password && <em className="field-error" role="alert">{t(shown.password)}</em>}{mode === 'register' && !shown.password && <small className="field-hint">{t('Use 12 or more characters, with letters and a number.')}</small>}</label>{error && <p className="form-error auth-wide" role="alert">{t(error)}</p>}<button type="submit" disabled={busy || (backendStatus && (!backendStatus.databaseConfigured || backendStatus.databaseConnected === false || !backendStatus.authenticationConfigured))} className="button button-dark auth-submit">{busy ? t('Please wait…') : mode === 'login' ? audience === 'admin' ? t('Sign in as administrator') : t('Sign in as farmer') : t('Create farmer account')} <ArrowRight size={15} /></button></form><div className="auth-switches"><button className="auth-switch" onClick={() => { setError(''); setTouched({}); if (audience === 'admin' && mode === 'login') onAudienceChange('farmer'); setMode(mode === 'login' ? 'register' : 'login') }}>{t(mode === 'login' ? audience === 'admin' ? 'Farmer sign-in / create account' : 'New to AgriVision? Create a farmer account' : 'Already registered? Sign in')}</button>{backendStatus?.databaseConnected === false ? <p className="auth-admin-link auth-setup-copy">{t('First-admin setup will be available once the Atlas connection is fixed.')}</p> : <button className="auth-switch auth-admin-link" onClick={onAdminSetup}>{t('Initial cooperative administrator setup')}</button>}</div></section></div></TranslateContent>
}

function AdminBootstrapModal({ onClose, onSession }) {
  const t = useTranslate()
  const [form, setForm] = useState({ bootstrapKey: '', name: '', email: '', password: '', farm: 'Cooperative administration', district: 'Maseru' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const update = (e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await apiRequest('/api/auth/admin/bootstrap', { method: 'POST', body: form })
      onSession(result.user)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }
  return <TranslateContent><div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="modal auth-modal" role="dialog" aria-modal="true" aria-labelledby="admin-bootstrap-heading"><div className="modal-head"><span className="modal-mark"><ShieldCheck size={18} /></span><button className="modal-close" onClick={onClose} aria-label="Close"><X size={19} /></button></div><h2 id="admin-bootstrap-heading">{t('Initial administrator setup')}</h2><p className="modal-subtitle">{t('Create the first cooperative admin. This one-time action requires your private Vercel bootstrap key.')}</p><form className="modal-form auth-form" onSubmit={submit}>{[['bootstrapKey', 'ONE-TIME SETUP KEY', 'password'], ['name', 'ADMINISTRATOR NAME', 'text'], ['email', 'ADMIN EMAIL', 'email'], ['password', 'ADMIN PASSWORD · 12+ CHARACTERS', 'password']].map(([name, label, type]) => <label className="form-field auth-wide" key={name}><span>{t(label)}</span><input name={name} type={type} value={form[name]} onChange={update} minLength={name === 'password' ? 12 : undefined} required /></label>)}{error && <p className="form-error auth-wide" role="alert">{error}</p>}<button className="button button-dark auth-submit" disabled={busy} type="submit">{busy ? t('Creating admin…') : t('Create administrator account')}</button></form></section></div></TranslateContent>
}

export default App
