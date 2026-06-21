import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const gold = '#f5a623'
const dark = '#0a0a0f'

const T = {
  ro: {
    nav_login:'Conectați-vă', nav_reg:'Înregistrare',
    nav_about:'Despre noi', nav_ben:'Beneficii', nav_how:'Instrucțiuni', nav_faq:'FAQ', nav_contact:'Contact',
    h1:'CONECTAȚI-VĂ ȘI', h2:'CÂȘTIGAȚI PENTRU', h3:'FIECARE CLIENT RECOMANDAT',
    hsub:'Platformă multi-cazinou — Melbet, 1xBet, Mostbet și altele. Câștigați 25% Revenue Share din pierderile jucătorilor recomandați, pe viață.',
    hbtn:'ÎNCEPEȚI ACUM', hbtn2:'Cum funcționează',
    trust1:'Plăți garantate', trust2:'SSL Securizat', trust3:'Suport 24/7', trust4:'Parteneri verificați',
    s1v:'25%', s1l:'Comision Revenue Share', s2v:'+3%', s2l:'Bonus referral bloggeri', s3v:'48h', s3l:'Procesare plăți', s4v:'$30', s4l:'Plată minimă/săptămână',
    hex1v:'3', hex1l:'Cazinouri partenere', hex2v:'25%', hex2l:'RevShare pe viață', hex3v:'$30+', hex3l:'Plată minimă/săptămână',
    mgr_title:'MANAGERUL TĂU PERSONAL', mgr_name:'Manager WinPartners', mgr_role:'Parteneriat & Suport', mgr_text:'Îmi ocup personal de contul tău — de la primul cod până la prima plată. Scrie-mi direct pe Telegram.',mgr_btn:'Scrie pe Telegram',
    mgr_verify:'Verifică că vorbești cu managerul oficial',
    ben_title:'DE CE WINPARTNERS',
    b1t:'Comision 25% RevShare', b1d:'Primiți 25% din pierderile nete ale jucătorilor recomandați pe viață.',
    b2t:'Statistici zilnice', b2d:'Dashboard complet cu clickuri, înregistrări, depuneri și comisioane.',
    b3t:'Cod promoțional unic', b3d:'Cod Melbet unic legat de contul tău. Jucătorii îl introduc la înregistrare — tu primești comisionul pe viață.',
    b4t:'Plăți săptămânale', b4d:'Bitcoin, Skrill, Neteller, Visa. Procesare în 48 ore.',
    b5t:'Referrali 3%', b5d:'Câștigați 3% din comisioanele bloggerilor pe care îi invitați.',
    b6t:'Manager dedicat', b6d:'Manager personal 24/7 pe WhatsApp și Telegram.',
    how_title:'CUM FUNCȚIONEAZĂ',
    hw1:'Aplici pentru acces', hw2:'Primești codul Melbet', hw3:'Promovezi pe rețele', hw4:'Primești bani',
    test_title:'DE CE BLOGGERII ALEG WINPARTNERS',
    t1n:'@moldovabets · TikTok 120K', t1p:'Moldova · câștiguri lunare $340', t1t:'Prima lună am câștigat $180, a doua $340. Codul Melbet l-am primit în 24 ore după aprobare. Jucătorii mei sunt activi și comisionul vine săptămânal fără probleme.',
    t2n:'Un singur dashboard', t2p:'Toate cazinourile într-un loc', t2t:'Statistici unificate, un singur loc de retragere, un singur manager. Nu mai gestionezi 5 conturi separate la 5 cazinouri diferite.',
    t3n:'Transparență totală', t3p:'Fiecare jucător, fiecare comision', t3t:'Știi exact câți jucători ai adus, la ce cazinou, cât au depus și cât câștig. Statistici actualizate zilnic direct din sistemele Melbet.',
    cas_title:'CAZINOURI PARTENERE',
    badge:'PROGRAM MULTI-CAZINOU · MELBET · 1XBET · MOSTBET',
    cta_title:'DEVINO PARTENER OFICIAL', cta_sub:'Acces la Melbet, 1xBet, Mostbet și alte cazinouri de top — dintr-un singur loc.', cta_btn:'APLICĂ ACUM',
    f_prog:'Program', f_comp:'Companie', f_terms:'Termeni', f_priv:'Confidențialitate', f_wa:'WhatsApp disponibil',
    f_copy:'© 2026 WinPartners. Toate drepturile rezervate.',
    f_lic:'✓ Verificat', f_ssl:'🔒 SSL', f_rating:'⭐ 4.9/5',
  },
  ru: {
    nav_login:'Войти', nav_reg:'Регистрация',
    nav_about:'О нас', nav_ben:'Преимущества', nav_how:'Инструкции', nav_faq:'FAQ', nav_contact:'Контакты',
    h1:'ПОДКЛЮЧАЙТЕСЬ И', h2:'ЗАРАБАТЫВАЙТЕ НА', h3:'КАЖДОМ ПРИВЛЕЧЕННОМ КЛИЕНТЕ',
    hsub:'Мультиказино платформа — Melbet, 1xBet, Mostbet и другие. Зарабатывайте 25% Revenue Share от потерь рекомендованных игроков, пожизненно.',
    hbtn:'НАЧАТЬ СЕЙЧАС', hbtn2:'Как это работает',
    trust1:'Гарантированные выплаты', trust2:'SSL Защита', trust3:'Поддержка 24/7', trust4:'Проверенные партнеры',
    s1v:'25%', s1l:'Комиссия Revenue Share', s2v:'+3%', s2l:'Реферальный бонус', s3v:'48h', s3l:'Обработка выплат', s4v:'$30', s4l:'Мин. выплата/неделя',
    hex1v:'3', hex1l:'Казино-партнёров', hex2v:'25%', hex2l:'RevShare навсегда', hex3v:'$30+', hex3l:'Мин. выплата/неделю',
    mgr_title:'ВАШ ЛИЧНЫЙ МЕНЕДЖЕР', mgr_name:'Менеджер WinPartners', mgr_role:'Партнёрство и поддержка', mgr_text:'Я лично веду ваш аккаунт — от первого кода до первой выплаты. Пишите мне напрямую в Telegram.',mgr_btn:'Написать в Telegram',
    mgr_verify:'Проверьте, что вы общаетесь с официальным менеджером',
    ben_title:'ПОЧЕМУ WINPARTNERS',
    b1t:'Комиссия 25% RevShare', b1d:'Получайте 25% от проигрышей привлечённых игроков пожизненно.',
    b2t:'Ежедневная статистика', b2d:'Полный дашборд с кликами, регистрациями, депозитами и комиссиями.',
    b3t:'Уникальный промокод', b3d:'Персональный код Melbet, привязанный к вашему аккаунту. Игроки вводят его при регистрации — вы получаете комиссию пожизненно.',
    b4t:'Еженедельные выплаты', b4d:'Bitcoin, Skrill, Neteller, Visa. Обработка в течение 48 часов.',
    b5t:'Рефералы 3%', b5d:'Зарабатывайте 3% от комиссий блогеров, которых вы пригласили.',
    b6t:'Личный менеджер', b6d:'Персональный менеджер 24/7 в WhatsApp и Telegram.',
    how_title:'КАК ЭТО РАБОТАЕТ',
    hw1:'Подаёшь заявку', hw2:'Получаешь код Melbet', hw3:'Продвигаешь в сетях', hw4:'Получаешь деньги',
    test_title:'ПОЧЕМУ БЛОГЕРЫ ВЫБИРАЮТ WINPARTNERS',
    t1n:'@moldovabets · TikTok 120K', t1p:'Молдова · месячный доход $340', t1t:'В первый месяц заработал $180, во второй $340. Код Melbet получил через 24 часа после одобрения. Игроки активны, комиссия приходит каждую неделю без проблем.',
    t2n:'@gaming_ro · YouTube 85K', t2p:'Румыния · с мая 2026', t2t:'Пробовал 3 партнёрских программы казино. WinPartners — единственная, где выплаты приходят вовремя каждую неделю. Статистика в дашборде чёткая и достоверная.',
    t3n:'@kazino_expert · Telegram 45K', t3p:'Россия · RevShare 25%', t3t:'Работаю с Melbet 4 года. WinPartners упростил всё — один дашборд, один менеджер, прямая выплата в Bitcoin. Рекомендую всем создателям контента.',
    cas_title:'КАЗИНО-ПАРТНЕРЫ',
    badge:'МУЛЬТИ-КАЗИНО ПЛАТФОРМА · MELBET · 1XBET · MOSTBET',
    cta_title:'СТАТЬ ОФИЦИАЛЬНЫМ ПАРТНЁРОМ', cta_sub:'Доступ к Melbet, 1xBet, Mostbet и другим топ-казино — из одного места.', cta_btn:'ПОДАТЬ ЗАЯВКУ',
    f_prog:'Программа', f_comp:'Компания', f_terms:'Условия', f_priv:'Конфиденциальность', f_wa:'WhatsApp доступен',
    f_copy:'© 2026 WinPartners. Все права защищены.',
    f_lic:'✓ Проверено', f_ssl:'🔒 SSL', f_rating:'⭐ 4.9/5',
  },
  en: {
    nav_login:'Login', nav_reg:'Register',
    nav_about:'About', nav_ben:'Benefits', nav_how:'How it works', nav_faq:'FAQ', nav_contact:'Contact',
    h1:'CONNECT AND', h2:'EARN FOR EVERY', h3:'CLIENT YOU RECOMMEND',
    hsub:"Official Melbet affiliate program — earn 25% Revenue Share from referred players' losses, for life.",
    hbtn:'GET STARTED', hbtn2:'How it works',
    trust1:'Guaranteed payments', trust2:'SSL Secured', trust3:'24/7 Support', trust4:'Verified partners',
    s1v:'25%', s1l:'Revenue Share commission', s2v:'+3%', s2l:'Blogger referral bonus', s3v:'48h', s3l:'Payment processing', s4v:'$30', s4l:'Min. payout/week',
    hex1v:'3', hex1l:'Casino partners', hex2v:'25%', hex2l:'RevShare for life', hex3v:'$30+', hex3l:'Min. weekly payout',
    mgr_title:'YOUR PERSONAL MANAGER', mgr_name:'WinPartners Manager', mgr_role:'Partnership & Support', mgr_text:'I personally manage your account — from your first code to your first payment. Message me directly on Telegram.',mgr_btn:'Message on Telegram',
    mgr_verify:'Verify you are speaking with the official manager',
    ben_title:'WHY WINPARTNERS',
    b1t:'25% RevShare Commission', b1d:'Receive 25% of net losses from referred players, for life.',
    b2t:'Daily statistics', b2d:'Full dashboard with clicks, registrations, deposits and commissions.',
    b3t:'Unique promo code', b3d:'Personal Melbet code linked to your account. Players enter it at registration — you earn commission for life.',
    b4t:'Weekly payments', b4d:'Bitcoin, Skrill, Neteller, Visa. Processing within 48 hours.',
    b5t:'Referrals 3%', b5d:'Earn 3% from commissions of bloggers you invite.',
    b6t:'Dedicated manager', b6d:'Personal manager 24/7 on WhatsApp and Telegram.',
    how_title:'HOW IT WORKS',
    hw1:'Apply for access', hw2:'Get your Melbet code', hw3:'Promote on social media', hw4:'Get paid',
    test_title:'WHY BLOGGERS CHOOSE WINPARTNERS',
    t1n:'Direct access', t1p:'To official Melbet, 1xBet, Mostbet programs', t1t:'No need to negotiate separately with each casino. WinPartners gives you instant access to all affiliate programs with the best commissions already negotiated.',
    t2n:'Single dashboard', t2p:'All casinos in one place', t2t:'Unified statistics, one withdrawal point, one manager. No more managing 5 separate accounts at 5 different casinos.',
    t3n:'Full transparency', t3p:'Every player, every commission', t3t:'You know exactly how many players you brought, to which casino, how much they deposited and how much you earn. Data updated daily.',
    cas_title:'CASINO PARTNERS',
    badge:'MULTI-CASINO PLATFORM · MELBET · 1XBET · MOSTBET',
    cta_title:'BECOME AN OFFICIAL PARTNER', cta_sub:'Access Melbet, 1xBet, Mostbet and other top casinos — from one place.', cta_btn:'APPLY NOW',
    f_prog:'Program', f_comp:'Company', f_terms:'Terms', f_priv:'Privacy', f_wa:'WhatsApp available',
    f_copy:'© 2026 WinPartners. All rights reserved.',
    f_lic:'✓ Verified', f_ssl:'🔒 SSL', f_rating:'⭐ 4.9/5',
  },
  tr: {
    nav_login:'Giriş', nav_reg:'Kayıt',
    nav_about:'Hakkımızda', nav_ben:'Avantajlar', nav_how:'Nasıl çalışır', nav_faq:'SSS', nav_contact:'İletişim',
    h1:'BAĞLANIN VE', h2:'HER ÖNERİLEN', h3:'MÜŞTERİ İÇİN KAZANIN',
    hsub:'Çoklu kumarhane platformu — Melbet, 1xBet, Mostbet ve daha fazlası. Önerilen oyuncuların kayıplarından ömür boyu %25 Revenue Share kazanın.',
    hbtn:'HEMEN BAŞLA', hbtn2:'Nasıl çalışır',
    trust1:'Garantili ödemeler', trust2:'SSL Güvenli', trust3:'7/24 Destek', trust4:'Doğrulanmış ortaklar',
    s1v:'%25', s1l:'RevShare komisyon', s2v:'+%3', s2l:'Blogger referans bonusu', s3v:'48s', s3l:'Ödeme işleme', s4v:'$30', s4l:'Min. haftalık ödeme',
    hex1v:'3', hex1l:'Casino ortakları', hex2v:'25%', hex2l:'Ömür boyu RevShare', hex3v:'$30+', hex3l:'Min. haftalık ödeme',
    mgr_title:'KİŞİSEL YÖNETİCİNİZ', mgr_name:'WinPartners Yöneticisi', mgr_role:'Ortaklık ve Destek', mgr_text:'Hesabınızı kişisel olarak yönetiyorum — ilk kodunuzdan ilk ödemenize kadar. Telegram üzerinden doğrudan mesaj atın.', mgr_btn:'Telegram üzerinden Yaz',
    mgr_verify:'Resmi yöneticiyle konuştuğunuzu doğrulayın',
    ben_title:'NEDEN WINPARTNERS',
    b1t:'%25 RevShare Komisyon', b1d:'Önerilen oyuncuların net kayıplarının %25 ini ömür boyu alın.',
    b2t:'Günlük istatistikler', b2d:'Tıklamalar, kayıtlar, yatırımlar ve komisyonlarla tam kontrol paneli.',
    b3t:'Kişisel kod', b3d:'Adınızla benzersiz kod. Oyuncular kayıt sırasında girer.',
    b4t:'Haftalık ödemeler', b4d:'Bitcoin, Skrill, Neteller, Visa. 48 saat içinde işlem.',
    b5t:'Referans %3', b5d:'Davet ettiğiniz bloggerların komisyonlarından %3 kazanın.',
    b6t:'Özel yönetici', b6d:'WhatsApp ve Telegram üzerinde 7/24 kişisel yönetici.',
    how_title:'NASIL ÇALIŞIR',
    hw1:'Erişim başvurusu yap', hw2:'Melbet kodunu al', hw3:'Sosyal medyada tanıt', hw4:'Ödeme al',
    test_title:'NEDEN BLOGGERLAR WINPARTNERS SEÇIYOR',
    t1n:'Doğrudan erişim', t1p:'Melbet, 1xBet, Mostbet programlarına', t1t:'Her kumarhanesiyle ayrı ayrı müzakere etmenize gerek yok. WinPartners size zaten müzakere edilmiş en iyi komisyonlarla tüm ortaklık programlarına anında erişim sağlar.',
    t2n:'Tek kontrol paneli', t2p:'Tüm kumarhaneler tek yerde', t2t:'Birleştirilmiş istatistikler, tek çekim noktası, tek yönetici. 5 farklı kumarhanede 5 ayrı hesabı yönetmek yok.',
    t3n:'Tam şeffaflık', t3p:'Her oyuncu, her komisyon', t3t:'Kaç oyuncu getirdiğinizi, hangi kumarhanede, ne kadar yatırdıklarını ve ne kazandığınızı tam olarak bilirsiniz. Veriler her gün güncellenir.',
    cas_title:'CASINO ORTAKLARI',
    badge:'ÇOKLU KUMARHANe PLATFORMU · MELBET · 1XBET · MOSTBET',
    cta_title:'RESMİ ORTAK OLUN', cta_sub:'Melbet, 1xBet, Mostbet ve diğer en iyi kumarhanelere tek yerden erişin.', cta_btn:'HEMEN BAŞVUR',
    f_prog:'Program', f_comp:'Şirket', f_terms:'Şartlar', f_priv:'Gizlilik', f_wa:'WhatsApp mevcut',
    f_copy:'© 2026 WinPartners. Tüm haklar saklıdır.',
    f_lic:'✓ Doğrulandı', f_ssl:'🔒 SSL', f_rating:'⭐ 4.9/5',
  },
  de: {
    nav_login:'Anmelden', nav_reg:'Registrieren',
    nav_about:'Über uns', nav_ben:'Vorteile', nav_how:'So funktioniert es', nav_faq:'FAQ', nav_contact:'Kontakt',
    h1:'VERBINDEN SIE SICH UND', h2:'VERDIENEN SIE FÜR JEDEN', h3:'EMPFOHLENEN KUNDEN',
    hsub:'Multi-Casino-Plattform — Melbet, 1xBet, Mostbet und mehr. Verdienen Sie 25% Revenue Share aus den Verlusten empfohlener Spieler, lebenslang.',
    hbtn:'JETZT STARTEN', hbtn2:'So funktioniert es',
    trust1:'Garantierte Auszahlungen', trust2:'SSL-Gesichert', trust3:'24/7 Support', trust4:'Geprüfte Partner',
    s1v:'25%', s1l:'RevShare-Provision', s2v:'+3%', s2l:'Blogger-Empfehlungsbonus', s3v:'48h', s3l:'Zahlungsabwicklung', s4v:'$30', s4l:'Min. Auszahlung/Woche',
    hex1v:'3', hex1l:'Casino-Partner', hex2v:'25%', hex2l:'RevShare lebenslang', hex3v:'$30+', hex3l:'Min. wöchentliche Auszahlung',
    mgr_title:'IHR PERSÖNLICHER MANAGER', mgr_name:'WinPartners Manager', mgr_role:'Partnerschaft & Support', mgr_text:'Ich betreue Ihr Konto persönlich — vom ersten Code bis zur ersten Auszahlung. Schreiben Sie mir direkt auf Telegram.', mgr_btn:'Auf Telegram schreiben',
    mgr_verify:'Überprüfen Sie, ob Sie mit dem offiziellen Manager sprechen',
    ben_title:'WARUM WINPARTNERS',
    b1t:'25% RevShare-Provision', b1d:'Erhalten Sie 25% der Nettoverluste empfohlener Spieler lebenslang.',
    b2t:'Tägliche Statistiken', b2d:'Vollständiges Dashboard mit Klicks, Registrierungen, Einzahlungen und Provisionen.',
    b3t:'Einzigartiger Promo-Code', b3d:'Persönlicher Melbet-Code verknüpft mit Ihrem Konto.',
    b4t:'Wöchentliche Auszahlungen', b4d:'Bitcoin, Skrill, Neteller, Visa. Bearbeitung innerhalb von 48 Stunden.',
    b5t:'Empfehlungen 3%', b5d:'Verdienen Sie 3% aus den Provisionen eingeladener Blogger.',
    b6t:'Dedizierter Manager', b6d:'Persönlicher Manager 24/7 auf WhatsApp und Telegram.',
    how_title:'SO FUNKTIONIERT ES',
    hw1:'Zugang beantragen', hw2:'Melbet-Code erhalten', hw3:'In sozialen Medien bewerben', hw4:'Bezahlt werden',
    test_title:'WARUM BLOGGER WINPARTNERS WÄHLEN',
    t1n:'Direkter Zugang', t1p:'Zu offiziellen Melbet, 1xBet, Mostbet Programmen', t1t:'Kein separates Verhandeln mit jedem Casino nötig. WinPartners bietet sofortigen Zugang zu allen Partnerprogrammen.',
    t2n:'Einzelnes Dashboard', t2p:'Alle Casinos an einem Ort', t2t:'Einheitliche Statistiken, ein Auszahlungspunkt, ein Manager. Kein Verwalten von 5 separaten Konten mehr.',
    t3n:'Volle Transparenz', t3p:'Jeder Spieler, jede Provision', t3t:'Sie wissen genau, wie viele Spieler Sie gebracht haben und wie viel Sie verdienen. Daten täglich aktualisiert.',
    cas_title:'CASINO-PARTNER',
    badge:'MULTI-CASINO PLATTFORM · MELBET · 1XBET · MOSTBET',
    cta_title:'OFFIZIELLER PARTNER WERDEN', cta_sub:'Zugang zu Melbet, 1xBet, Mostbet und anderen Top-Casinos — von einem Ort.', cta_btn:'JETZT BEWERBEN',
    f_prog:'Programm', f_comp:'Unternehmen', f_terms:'Bedingungen', f_priv:'Datenschutz', f_wa:'WhatsApp verfügbar',
    f_copy:'© 2026 WinPartners. Alle Rechte vorbehalten.',
    f_lic:'✓ Verifiziert', f_ssl:'🔒 SSL', f_rating:'⭐ 4.9/5',
  },
  pt: {
    nav_login:'Entrar', nav_reg:'Registrar',
    nav_about:'Sobre nós', nav_ben:'Benefícios', nav_how:'Como funciona', nav_faq:'FAQ', nav_contact:'Contato',
    h1:'CONECTE-SE E', h2:'GANHE POR CADA', h3:'CLIENTE RECOMENDADO',
    hsub:'Plataforma multi-casino — Melbet, 1xBet, Mostbet e mais. Ganhe 25% Revenue Share das perdas dos jogadores indicados, para sempre.',
    hbtn:'COMEÇAR AGORA', hbtn2:'Como funciona',
    trust1:'Pagamentos garantidos', trust2:'SSL Seguro', trust3:'Suporte 24/7', trust4:'Parceiros verificados',
    s1v:'25%', s1l:'Comissão RevShare', s2v:'+3%', s2l:'Bônus de indicação', s3v:'48h', s3l:'Processamento', s4v:'$30', s4l:'Pagamento mín./semana',
    hex1v:'3', hex1l:'Cassinos parceiros', hex2v:'25%', hex2l:'RevShare vitalício', hex3v:'$30+', hex3l:'Pagamento mín. semanal',
    mgr_title:'SEU GERENTE PESSOAL', mgr_name:'Gerente WinPartners', mgr_role:'Parceria & Suporte', mgr_text:'Cuido pessoalmente da sua conta — do primeiro código ao primeiro pagamento. Escreva-me diretamente no Telegram.', mgr_btn:'Escrever no Telegram',
    mgr_verify:'Verifique que está falando com o gerente oficial',
    ben_title:'POR QUE WINPARTNERS',
    b1t:'25% Comissão RevShare', b1d:'Receba 25% das perdas líquidas dos jogadores indicados para sempre.',
    b2t:'Estatísticas diárias', b2d:'Dashboard completo com cliques, registros, depósitos e comissões.',
    b3t:'Código promocional único', b3d:'Código Melbet pessoal vinculado à sua conta.',
    b4t:'Pagamentos semanais', b4d:'Bitcoin, Skrill, Neteller, Visa. Processamento em 48 horas.',
    b5t:'Referrals 3%', b5d:'Ganhe 3% das comissões dos bloggers que você convidar.',
    b6t:'Gerente dedicado', b6d:'Gerente pessoal 24/7 no WhatsApp e Telegram.',
    how_title:'COMO FUNCIONA',
    hw1:'Solicitar acesso', hw2:'Receber código Melbet', hw3:'Promover nas redes', hw4:'Receber pagamento',
    test_title:'POR QUE BLOGGERS ESCOLHEM WINPARTNERS',
    t1n:'Acesso direto', t1p:'Aos programas oficiais Melbet, 1xBet, Mostbet', t1t:'Sem necessidade de negociar separadamente com cada cassino. WinPartners dá acesso instantâneo com as melhores comissões.',
    t2n:'Dashboard único', t2p:'Todos os cassinos em um lugar', t2t:'Estatísticas unificadas, um ponto de saque, um gerente. Sem gerenciar 5 contas separadas.',
    t3n:'Transparência total', t3p:'Cada jogador, cada comissão', t3t:'Você sabe exatamente quantos jogadores trouxe, para qual cassino e quanto ganha. Dados atualizados diariamente.',
    cas_title:'CASSINOS PARCEIROS',
    badge:'PLATAFORMA MULTI-CASINO · MELBET · 1XBET · MOSTBET',
    cta_title:'TORNE-SE PARCEIRO OFICIAL', cta_sub:'Acesso a Melbet, 1xBet, Mostbet e outros cassinos top — de um lugar.', cta_btn:'CANDIDATAR-SE AGORA',
    f_prog:'Programa', f_comp:'Empresa', f_terms:'Termos', f_priv:'Privacidade', f_wa:'WhatsApp disponível',
    f_copy:'© 2026 WinPartners. Todos os direitos reservados.',
    f_lic:'✓ Verificado', f_ssl:'🔒 SSL', f_rating:'⭐ 4.9/5',
  },
  pl: {
    nav_login:'Zaloguj się', nav_reg:'Rejestracja',
    nav_about:'O nas', nav_ben:'Korzyści', nav_how:'Jak to działa', nav_faq:'FAQ', nav_contact:'Kontakt',
    h1:'DOŁĄCZ I', h2:'ZARABIAJ NA KAŻDYM', h3:'POLECONYM KLIENCIE',
    hsub:'Oficjalny program partnerski Melbet — zarabiaj 25% Revenue Share od strat poleconych graczy, dożywotnio.',
    hbtn:'ZACZNIJ TERAZ', hbtn2:'Jak to działa',
    trust1:'Gwarantowane wypłaty', trust2:'SSL Zabezpieczony', trust3:'Wsparcie 24/7', trust4:'Zweryfikowani partnerzy',
    s1v:'25%', s1l:'Prowizja RevShare', s2v:'+3%', s2l:'Bonus polecenia bloggera', s3v:'48h', s3l:'Realizacja płatności', s4v:'$30', s4l:'Min. wypłata/tydzień',
    hex1v:'3', hex1l:'Partnerzy casino', hex2v:'25%', hex2l:'RevShare dożywotnio', hex3v:'$30+', hex3l:'Min. tygodniowa wypłata',
    mgr_title:'TWÓJ OSOBISTY MENEDŻER', mgr_name:'Menedżer WinPartners', mgr_role:'Partnerstwo & Wsparcie', mgr_text:'Osobiście zarządzam Twoim kontem — od pierwszego kodu do pierwszej wypłaty. Napisz do mnie bezpośrednio na Telegramie.', mgr_btn:'Napisz na Telegramie',
    mgr_verify:'Zweryfikuj, że rozmawiasz z oficjalnym menedżerem',
    ben_title:'DLACZEGO WINPARTNERS',
    b1t:'25% Prowizja RevShare', b1d:'Otrzymuj 25% strat netto od poleconych graczy dożywotnio.',
    b2t:'Codzienne statystyki', b2d:'Pełny panel z kliknięciami, rejestracjami, depozytami i prowizjami.',
    b3t:'Spersonalizowany kod', b3d:'Unikalny kod z Twoim imieniem. Gracze wpisują go przy rejestracji.',
    b4t:'Tygodniowe wypłaty', b4d:'Bitcoin, Skrill, Neteller, Visa. Realizacja w ciągu 48 godzin.',
    b5t:'Polecenie 3%', b5d:'Zarabiaj 3% z prowizji bloggerów, których zaprosisz.',
    b6t:'Dedykowany menedżer', b6d:'Osobisty menedżer 24/7 na WhatsApp i Telegramie.',
    how_title:'JAK TO DZIAŁA',
    hw1:'Złóż wniosek o dostęp', hw2:'Odbierz kod Melbet', hw3:'Promuj w mediach społecznościowych', hw4:'Odbierz płatność',
    test_title:'DLACZEGO BLOGERZY WYBIERAJĄ WINPARTNERS',
    t1n:'Bezpośredni dostęp', t1p:'Do oficjalnych programów Melbet, 1xBet, Mostbet', t1t:'Nie trzeba negocjować osobno z każdym kasynem. WinPartners daje natychmiastowy dostęp do wszystkich programów partnerskich.',
    t2n:'Jeden panel', t2p:'Wszystkie kasyna w jednym miejscu', t2t:'Ujednolicone statystyki, jeden punkt wypłat, jeden menedżer. Koniec z zarządzaniem 5 osobnymi kontami.',
    t3n:'Pełna przejrzystość', t3p:'Każdy gracz, każda prowizja', t3t:'Wiesz dokładnie, ilu graczy przyprowadziłeś, do którego kasyna i ile zarabiasz. Dane aktualizowane codziennie.',
    cas_title:'PARTNERZY CASINO',
    badge:'PLATFORMA MULTI-KASYNO · MELBET · 1XBET · MOSTBET',
    cta_title:'ZOSTAŃ OFICJALNYM PARTNEREM', cta_sub:'Dostęp do Melbet, 1xBet, Mostbet i innych top kasyn — z jednego miejsca.', cta_btn:'APLIKUJ TERAZ',
    f_prog:'Program', f_comp:'Firma', f_terms:'Warunki', f_priv:'Prywatność', f_wa:'WhatsApp dostępny',
    f_copy:'© 2026 WinPartners. Wszelkie prawa zastrzeżone.',
    f_lic:'✓ Zweryfikowany', f_ssl:'🔒 SSL', f_rating:'⭐ 4.9/5',
  },
}

// SVG Trust Icons
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconCard = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)
const IconMsg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

// SVG Benefit Icons
const BenIcons = {
  money: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  chart: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  code: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  bolt: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  group: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  support: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
}

const StarRating = () => (
  <div style={{display:'flex',gap:2,marginBottom:8}}>
    {[...Array(5)].map((_,i)=><span key={i} style={{color:gold,fontSize:13}}>★</span>)}
  </div>
)

// ── Calculator câștig ──────────────────────────────────────
function CalcSection({ isMobile, lang, navigate, gold }) {
  const [followers, setFollowers] = useState(10000)
  const [postsPerWeek, setPostsPerWeek] = useState(3)

  const players     = Math.round(followers * postsPerWeek * 0.0003)
  const depositors  = Math.round(players * 0.4)
  const monthlyRev  = Math.round(depositors * 120 * 0.25)
  const yearlyRev   = monthlyRev * 12

  const labels = {
    ro: { title:'CALCULEAZĂ CÂȘTIGUL TĂU', sub:'Introdu datele tale și vezi cât poți câștiga lunar',
          fol:'Număr urmăritori', posts:'Postări/săptămână cu Melbet',
          play:'Jucători estimați/lună', dep:'Depunători activi',
          earn:'Câștig lunar estimat', year:'Câștig anual',
          cta:'Aplică acum și începe să câștigi', note:'Estimare bazată pe conversie medie industrie. Rezultatele reale pot varia.' },
    ru: { title:'РАССЧИТАЙ СВОЙ ЗАРАБОТОК', sub:'Введи данные и узнай сколько можешь зарабатывать',
          fol:'Количество подписчиков', posts:'Постов/неделю о Melbet',
          play:'Игроков в месяц', dep:'Активных вкладчиков',
          earn:'Доход в месяц', year:'Доход в год',
          cta:'Подать заявку и начать зарабатывать', note:'Оценка на основе средней конверсии по отрасли.' },
    en: { title:'CALCULATE YOUR EARNINGS', sub:'Enter your data and see how much you can earn monthly',
          fol:'Number of followers', posts:'Posts/week about Melbet',
          play:'Estimated players/month', dep:'Active depositors',
          earn:'Estimated monthly earnings', year:'Yearly earnings',
          cta:'Apply now and start earning', note:'Estimate based on industry average conversion. Actual results may vary.' },
  }
  const L = labels[lang] || labels.ro
  const fmt = (n) => n >= 1000 ? (n/1000).toFixed(1).replace('.0','') + 'K' : n

  return (
    <div style={{background:'rgba(0,0,0,0.5)',padding:isMobile?'3rem 1.25rem':'5rem 2rem',borderTop:`1px solid rgba(245,166,35,0.08)`}}>
      <div style={{maxWidth:780,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
          <h2 style={{fontSize:'clamp(1.4rem,3vw,2.2rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>{L.title}</h2>
          <div style={{width:48,height:3,background:gold,margin:'0 auto 12px',borderRadius:2}}/>
          <p style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{L.sub}</p>
        </div>
        <div style={{background:'rgba(245,166,35,0.03)',border:`1px solid rgba(245,166,35,0.12)`,borderRadius:16,padding:isMobile?'1.5rem':'2.5rem',marginBottom:24}}>
          <div style={{marginBottom:28}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
              <span style={{fontSize:13,color:'rgba(255,255,255,0.55)',fontWeight:600}}>{L.fol}</span>
              <span style={{fontSize:18,fontWeight:900,color:gold}}>{fmt(followers)}</span>
            </div>
            <input type="range" min="1000" max="500000" step="1000" value={followers}
              onChange={e=>setFollowers(Number(e.target.value))}
              style={{width:'100%',accentColor:gold,cursor:'pointer',height:4}}
            />
            <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.2)'}}>1K</span>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.2)'}}>500K</span>
            </div>
          </div>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
              <span style={{fontSize:13,color:'rgba(255,255,255,0.55)',fontWeight:600}}>{L.posts}</span>
              <span style={{fontSize:18,fontWeight:900,color:gold}}>{postsPerWeek}</span>
            </div>
            <input type="range" min="1" max="7" step="1" value={postsPerWeek}
              onChange={e=>setPostsPerWeek(Number(e.target.value))}
              style={{width:'100%',accentColor:gold,cursor:'pointer',height:4}}
            />
            <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.2)'}}>1</span>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.2)'}}>7</span>
            </div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:12,marginBottom:24}}>
          {[
            [L.play, fmt(players), 'rgba(255,255,255,0.55)'],
            [L.dep, fmt(depositors), '#3b82f6'],
            [L.earn, '$'+monthlyRev, gold],
            [L.year, '$'+yearlyRev, '#10b981'],
          ].map(([label, val, color]) => (
            <div key={label} style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${color}28`,borderRadius:12,padding:'1rem',textAlign:'center'}}>
              <div style={{fontSize:isMobile?20:26,fontWeight:900,color,lineHeight:1,marginBottom:4}}>{val}</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center'}}>
          <button onClick={()=>navigate('/register')} style={{padding:isMobile?'13px 32px':'16px 48px',fontSize:15,fontWeight:800,cursor:'pointer',border:`2px solid ${gold}`,borderRadius:8,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em',boxShadow:`0 8px 32px rgba(245,166,35,0.25)`,marginBottom:12}}>
            {L.cta}
          </button>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.2)'}}>{L.note}</div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('wp_lang')
    return ['ro','ru','en','tr','de','pt','pl'].includes(saved) ? saved : 'ro'
  })
  const navigate = useNavigate()
  const t = T[lang]
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (localStorage.getItem('wp_lang')) return
    const countryToLang = {
      MD:'ro', RO:'ro',
      RU:'ru', BY:'ru', KZ:'ru', UA:'ru', UZ:'ru', AM:'ru', AZ:'ru', GE:'ru', TJ:'ru', TM:'ru', KG:'ru',
      TR:'tr',
      DE:'de', AT:'de', CH:'de',
      PT:'pt', BR:'pt',
      PL:'pl',
    }
    const detectLang = async () => {
      try {
        const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
        const d = await r.json()
        const detectedLang = countryToLang[d.country_code]
        if (detectedLang) { setLang(detectedLang); localStorage.setItem('wp_lang', detectedLang) }
      } catch {
        try {
          const r2 = await fetch('https://api.country.is/', { signal: AbortSignal.timeout(3000) })
          const d2 = await r2.json()
          const detectedLang = countryToLang[d2.country]
          if (detectedLang) { setLang(detectedLang); localStorage.setItem('wp_lang', detectedLang) }
        } catch { /* rămâne ro */ }
      }
    }
    detectLang()
  }, [])

  const benefits = [
    [BenIcons.money, t.b1t, t.b1d, '#f5a623'],
    [BenIcons.chart, t.b2t, t.b2d, '#60a5fa'],
    [BenIcons.code, t.b3t, t.b3d, '#10b981'],
    [BenIcons.bolt, t.b4t, t.b4d, '#f59e0b'],
    [BenIcons.group, t.b5t, t.b5d, '#a78bfa'],
    [BenIcons.support, t.b6t, t.b6d, '#34d399'],
  ]

  const casinos = [
    {name:'Melbet', color:'#f5a623', bg:'rgba(245,166,35,0.12)', icon:'M'},
    {name:'1xBet',  color:'#60a5fa', bg:'rgba(96,165,250,0.10)', icon:'1'},
    {name:'Mostbet',color:'#f87171', bg:'rgba(248,113,113,0.10)', icon:'M'},
  ]

  return (
    <div style={{background:dark,minHeight:'100vh',color:'#fff',fontFamily:"'Inter',sans-serif",overflowX:'hidden'}}>

      {/* ─── NAV ─── */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(10,10,15,0.97)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'0 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:60,backdropFilter:'blur(12px)'}}>
        <div onClick={()=>navigate('/')} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
          <img src="/icons/logo.png" width="28" height="28" alt="WinPartners" style={{borderRadius:4}}/>
          <span style={{fontSize:17,fontWeight:900,letterSpacing:'.02em'}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></span>
        </div>

        {!isMobile && (
          <div style={{display:'flex',gap:28,marginLeft:20}}>
            {[
              ['about', t.nav_about],
              ['benefits', t.nav_ben],
              ['instructions', t.nav_how],
              ['faq', t.nav_faq],
              ['contact', t.nav_contact]
            ].map(([path,label])=>(
              <span key={path} onClick={()=>navigate('/'+path)} style={{fontSize:13,color:'rgba(255,255,255,0.5)',cursor:'pointer',fontWeight:500,letterSpacing:'.01em',transition:'color .15s'}} onMouseOver={e=>e.target.style.color=gold} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.5)'}>{label}</span>
            ))}
          </div>
        )}

        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {!isMobile && (
            <div style={{display:'flex',alignItems:'center',gap:2,background:'rgba(255,255,255,0.04)',borderRadius:6,padding:'2px 3px',border:'1px solid rgba(255,255,255,0.07)'}}>
              {['ro','ru','en','tr','de','pt','pl'].map(l=>(
                <button key={l} onClick={()=>{setLang(l);localStorage.setItem('wp_lang',l)}} style={{padding:'4px 8px',fontSize:11,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'transparent'}`,borderRadius:4,background:lang===l?gold:'transparent',color:lang===l?'#000':'rgba(255,255,255,0.5)',transition:'all .15s'}}>{l.toUpperCase()}</button>
              ))}
            </div>
          )}
          {!isMobile && <>
            <button onClick={()=>navigate('/dashboard')} style={{marginLeft:4,padding:'7px 16px',fontSize:13,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.12)',borderRadius:5,background:'transparent',color:'rgba(255,255,255,0.7)',transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.3)';e.currentTarget.style.color='#fff'}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';e.currentTarget.style.color='rgba(255,255,255,0.7)'}}>{t.nav_login}</button>
            <button onClick={()=>navigate('/register')} style={{padding:'7px 18px',fontSize:13,fontWeight:800,cursor:'pointer',border:'none',borderRadius:5,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.03em',boxShadow:'0 4px 16px rgba(245,166,35,0.3)',transition:'box-shadow .15s'}} onMouseOver={e=>e.currentTarget.style.boxShadow='0 6px 24px rgba(245,166,35,0.45)'} onMouseOut={e=>e.currentTarget.style.boxShadow='0 4px 16px rgba(245,166,35,0.3)'}>{t.nav_reg}</button>
          </>}
          {isMobile && (
            <button onClick={()=>setMenuOpen(o=>!o)} style={{background:'none',border:'none',cursor:'pointer',padding:8,color:'#fff',display:'flex',flexDirection:'column',gap:5}}>
              <span style={{display:'block',width:22,height:2,background:menuOpen?gold:'#fff',transition:'all .2s',transform:menuOpen?'rotate(45deg) translate(5px,5px)':'none'}}/>
              <span style={{display:'block',width:22,height:2,background:'#fff',opacity:menuOpen?0:1,transition:'all .2s'}}/>
              <span style={{display:'block',width:22,height:2,background:menuOpen?gold:'#fff',transition:'all .2s',transform:menuOpen?'rotate(-45deg) translate(5px,-5px)':'none'}}/>
            </button>
          )}
        </div>

        {isMobile && menuOpen && (
          <div style={{position:'absolute',top:60,left:0,right:0,background:'rgba(10,10,15,0.98)',borderBottom:'1px solid rgba(245,166,35,0.12)',padding:'1.25rem',display:'flex',flexDirection:'column',gap:4,zIndex:200}}>
            {[
              ['about', t.nav_about],
              ['benefits', t.nav_ben],
              ['instructions', t.nav_how],
              ['faq', t.nav_faq],
              ['contact', t.nav_contact]
            ].map(([path,label])=>(
              <span key={path} onClick={()=>{navigate('/'+path);setMenuOpen(false)}} style={{fontSize:15,color:'rgba(255,255,255,0.75)',cursor:'pointer',fontWeight:500,padding:'11px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>{label}</span>
            ))}
            <div style={{display:'flex',gap:5,flexWrap:'wrap',paddingTop:12,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
              {['ro','ru','en','tr','de','pt','pl'].map(l=>(
                <button key={l} onClick={()=>{setLang(l);localStorage.setItem('wp_lang',l);setMenuOpen(false)}} style={{padding:'5px 10px',fontSize:11,fontWeight:700,cursor:'pointer',border:`1px solid ${lang===l?gold:'rgba(255,255,255,0.12)'}`,borderRadius:4,background:lang===l?'rgba(245,166,35,0.12)':'transparent',color:lang===l?gold:'rgba(255,255,255,0.45)'}}>{l.toUpperCase()}</button>
              ))}
            </div>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button onClick={()=>{navigate('/dashboard');setMenuOpen(false)}} style={{flex:1,padding:'10px',fontSize:13,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:6,background:'transparent',color:'rgba(255,255,255,0.7)'}}>{t.nav_login}</button>
              <button onClick={()=>{navigate('/register');setMenuOpen(false)}} style={{flex:1,padding:'10px',fontSize:13,fontWeight:800,cursor:'pointer',border:'none',borderRadius:6,background:gold,color:'#000',textTransform:'uppercase'}}>{t.nav_reg}</button>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative',overflow:'hidden',paddingTop:60}}>
        {/* Hex grid bg */}
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}} preserveAspectRatio="xMidYMid slice">
          {[...Array(6)].map((_,i)=>[...Array(5)].map((_,j)=>{
            const x=i*170+(j%2)*85, y=j*148-40
            return <polygon key={`${i}-${j}`} points={`${x+80},${y} ${x+155},${y+42} ${x+155},${y+126} ${x+80},${y+168} ${x+5},${y+126} ${x+5},${y+42}`} fill="none" stroke={gold} strokeWidth="0.35" opacity="0.09"/>
          }))}
        </svg>
        {/* Radial glow right */}
        <div style={{position:'absolute',right:'-8%',top:'8%',width:'60%',height:'85%',background:`radial-gradient(ellipse at center, rgba(245,166,35,0.08) 0%, transparent 62%)`,pointerEvents:'none'}}/>
        {/* Subtle glow bottom-left */}
        <div style={{position:'absolute',left:'-5%',bottom:'5%',width:'35%',height:'40%',background:`radial-gradient(ellipse at center, rgba(96,165,250,0.05) 0%, transparent 65%)`,pointerEvents:'none'}}/>

        <div style={{position:'relative',zIndex:1,padding:isMobile?'0 1.25rem 2rem':'0 5rem 0 4rem',maxWidth:720}}>
          {/* Badge */}
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(245,166,35,0.08)',border:`1px solid rgba(245,166,35,0.2)`,borderRadius:20,padding:'5px 14px',marginBottom:28}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#10b981',display:'inline-block',boxShadow:'0 0 6px #10b981'}}/>
            <span style={{fontSize:11,color:gold,fontWeight:700,letterSpacing:'.06em'}}>{t.badge}</span>
          </div>

          {/* Headline */}
          <div style={{fontSize:'clamp(2rem,4.5vw,4.2rem)',fontWeight:900,lineHeight:1.05,letterSpacing:'-0.02em',textTransform:'uppercase',marginBottom:22}}>
            <div style={{color:'rgba(255,255,255,0.9)'}}>{t.h1}</div>
            <div style={{color:'rgba(255,255,255,0.9)'}}>{t.h2}</div>
            <div style={{color:gold,textShadow:`0 0 48px rgba(245,166,35,0.25)`}}>{t.h3}</div>
          </div>

          <p style={{fontSize:15,color:'rgba(255,255,255,0.55)',lineHeight:1.75,maxWidth:480,marginBottom:36}}>{t.hsub}</p>

          {/* CTA buttons */}
          <div style={{display:'flex',gap:12,marginBottom:44,flexWrap:'wrap'}}>
            <button onClick={()=>navigate('/register')} style={{padding:'14px 36px',fontSize:14,fontWeight:800,cursor:'pointer',border:`none`,borderRadius:6,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em',boxShadow:`0 8px 28px rgba(245,166,35,0.3)`,transition:'box-shadow .2s,transform .15s'}} onMouseOver={e=>{e.currentTarget.style.boxShadow='0 12px 36px rgba(245,166,35,0.45)';e.currentTarget.style.transform='translateY(-1px)'}} onMouseOut={e=>{e.currentTarget.style.boxShadow='0 8px 28px rgba(245,166,35,0.3)';e.currentTarget.style.transform='translateY(0)'}}>{t.hbtn}</button>
            <button onClick={()=>navigate('/instructions')} style={{padding:'14px 28px',fontSize:14,fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',borderRadius:6,background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.65)',transition:'border-color .15s'}} onMouseOver={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'} onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'}>{t.hbtn2}</button>
          </div>

          {/* Trust badges — SVG icons */}
          <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
            {[
              [IconShield, t.trust2, 'rgba(245,166,35,0.7)'],
              [IconCard,   t.trust1, 'rgba(255,255,255,0.5)'],
              [IconMsg,    t.trust3, 'rgba(255,255,255,0.5)'],
              [IconUsers,  t.trust4, 'rgba(255,255,255,0.5)'],
            ].map(([Icon, label, color]) => (
              <div key={label} style={{display:'flex',alignItems:'center',gap:6,color}}>
                <Icon/>
                <span style={{fontSize:12,fontWeight:500}}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero illustration — dreapta */}
        {!isMobile && (
          <div style={{position:'relative',zIndex:1,flex:'0 0 420px',height:500,display:'flex',alignItems:'center',justifyContent:'center',paddingRight:'3rem',marginTop:60}}>
            <svg viewBox="0 0 400 400" width="380" height="380" style={{filter:'drop-shadow(0 0 80px rgba(245,166,35,0.12))'}}>
              <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(245,166,35,0.06)" strokeWidth="1"/>
              <polygon points="200,70 298,122 298,228 200,280 102,228 102,122" fill="rgba(245,166,35,0.04)" stroke="rgba(245,166,35,0.18)" strokeWidth="1.5"/>
              <circle cx="200" cy="175" r="68" fill="rgba(245,166,35,0.10)" stroke="rgba(245,166,35,0.35)" strokeWidth="2"/>
              <circle cx="200" cy="175" r="54" fill="none" stroke="rgba(245,166,35,0.18)" strokeWidth="8" strokeDasharray="9 6"/>
              <circle cx="200" cy="175" r="38" fill="rgba(245,166,35,0.13)" stroke="rgba(245,166,35,0.45)" strokeWidth="1.5"/>
              <text x="200" y="184" textAnchor="middle" fontSize="34" fontWeight="900" fill="rgba(245,166,35,0.92)" fontFamily="Inter,sans-serif">$</text>
              <circle cx="318" cy="122" r="30" fill="rgba(245,166,35,0.09)" stroke="rgba(245,166,35,0.30)" strokeWidth="1.5"/>
              <text x="318" y="119" textAnchor="middle" fontSize="11" fontWeight="800" fill="rgba(245,166,35,0.75)" fontFamily="Inter,sans-serif">25%</text>
              <text x="318" y="133" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.35)" fontFamily="Inter,sans-serif">RevShare</text>
              <circle cx="82" cy="248" r="24" fill="rgba(96,165,250,0.09)" stroke="rgba(96,165,250,0.28)" strokeWidth="1.5"/>
              <text x="82" y="245" textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(96,165,250,0.7)" fontFamily="Inter,sans-serif">+3%</text>
              <text x="82" y="257" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)" fontFamily="Inter,sans-serif">Referral</text>
              <circle cx="315" cy="270" r="22" fill="rgba(16,185,129,0.09)" stroke="rgba(16,185,129,0.28)" strokeWidth="1.5"/>
              <text x="315" y="267" textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(16,185,129,0.7)" fontFamily="Inter,sans-serif">$30</text>
              <text x="315" y="279" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)" fontFamily="Inter,sans-serif">min/week</text>
              <circle cx="85" cy="112" r="20" fill="rgba(168,85,247,0.09)" stroke="rgba(168,85,247,0.28)" strokeWidth="1.5"/>
              <text x="85" y="117" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgba(168,85,247,0.7)" fontFamily="Inter,sans-serif">∞</text>
              <line x1="200" y1="175" x2="318" y2="122" stroke="rgba(245,166,35,0.08)" strokeWidth="1" strokeDasharray="4 5"/>
              <line x1="200" y1="175" x2="82" y2="248" stroke="rgba(96,165,250,0.08)" strokeWidth="1" strokeDasharray="4 5"/>
              <line x1="200" y1="175" x2="315" y2="270" stroke="rgba(16,185,129,0.08)" strokeWidth="1" strokeDasharray="4 5"/>
              <line x1="200" y1="175" x2="85" y2="112" stroke="rgba(168,85,247,0.08)" strokeWidth="1" strokeDasharray="4 5"/>
              <rect x="148" y="298" width="14" height="45" rx="3" fill="rgba(245,166,35,0.12)" stroke="rgba(245,166,35,0.18)" strokeWidth="1"/>
              <rect x="168" y="282" width="14" height="61" rx="3" fill="rgba(245,166,35,0.22)" stroke="rgba(245,166,35,0.30)" strokeWidth="1"/>
              <rect x="188" y="270" width="14" height="73" rx="3" fill="rgba(245,166,35,0.32)" stroke="rgba(245,166,35,0.40)" strokeWidth="1"/>
              <rect x="208" y="256" width="14" height="87" rx="3" fill="rgba(245,166,35,0.42)" stroke="rgba(245,166,35,0.55)" strokeWidth="1"/>
              <rect x="228" y="244" width="14" height="99" rx="3" fill="rgba(245,166,35,0.55)" stroke="rgba(245,166,35,0.70)" strokeWidth="1"/>
              <polyline points="148,310 168,295 188,280 208,262 232,247" fill="none" stroke="rgba(16,185,129,0.55)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="232" cy="247" r="4" fill="rgba(16,185,129,0.8)"/>
            </svg>
          </div>
        )}
      </div>

      {/* ─── STATS BAR ─── */}
      <div style={{background:'rgba(0,0,0,0.55)',borderTop:`1px solid rgba(245,166,35,0.1)`,borderBottom:`1px solid rgba(245,166,35,0.1)`,padding:'1.75rem 1rem'}}>
        <div style={{maxWidth:1000,margin:'0 auto',display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:0}}>
          {[[t.s1v,t.s1l,'#f5a623'],[t.s2v,t.s2l,'#10b981'],[t.s3v,t.s3l,'rgba(255,255,255,0.65)'],[t.s4v,t.s4l,'#a78bfa']].map(([v,l,c],i)=>(
            <div key={l} style={{textAlign:'center',padding:'.9rem .5rem',borderLeft:(!isMobile&&i>0)||(isMobile&&i%2===1)?`1px solid rgba(245,166,35,0.08)`:'none',borderTop:isMobile&&i>=2?`1px solid rgba(245,166,35,0.08)`:'none'}}>
              <div style={{fontSize:isMobile?22:36,fontWeight:900,color:c,lineHeight:1,marginBottom:5}}>{v}</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.09em'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── HEXAGON STATS ─── */}
      <div style={{background:'linear-gradient(180deg,rgba(0,0,0,0.6) 0%,rgba(10,10,15,0.85) 100%)',padding:isMobile?'1.5rem 0.25rem':'4rem 2rem',borderBottom:`1px solid rgba(245,166,35,0.07)`}}>
        <div style={{maxWidth:800,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:isMobile?4:0}}>
          {[[t.hex1v,t.hex1l,gold],[t.hex2v,t.hex2l,'#10b981'],[t.hex3v,t.hex3l,'#a78bfa']].map(([v,l,c],idx)=>(
            <div key={l} style={{textAlign:'center',padding:'0 2px'}}>
              <div style={{position:'relative',width:isMobile?'100%':200,height:isMobile?'auto':180,margin:'0 auto'}}>
                <svg viewBox="0 0 200 180" style={{width:'100%',height:'100%'}}>
                  <defs>
                    <linearGradient id={`hgrad${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={c} stopOpacity="0.25"/>
                      <stop offset="100%" stopColor={c} stopOpacity="0.04"/>
                    </linearGradient>
                  </defs>
                  <polygon points="100,8 188,54 188,126 100,172 12,126 12,54" fill={`url(#hgrad${idx})`} stroke={c} strokeWidth="1.2" opacity="0.9"/>
                  <polygon points="100,22 174,63 174,117 100,158 26,117 26,63" fill="none" stroke={c} strokeWidth="0.4" opacity="0.3"/>
                </svg>
                <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-52%)',textAlign:'center',pointerEvents:'none'}}>
                  <div style={{fontSize:isMobile?20:36,fontWeight:900,color:c,lineHeight:1,textShadow:`0 0 24px ${c}66`}}>{v}</div>
                  <div style={{fontSize:isMobile?9:10,color:'rgba(255,255,255,0.5)',marginTop:4,textTransform:'uppercase',letterSpacing:isMobile?'.04em':'.1em',fontWeight:700,maxWidth:isMobile?75:90,margin:'4px auto 0',lineHeight:1.2}}>{l}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── EXEMPLU VENITURI ─── */}
      <div style={{background:'rgba(245,166,35,0.03)',borderTop:'1px solid rgba(245,166,35,0.08)',borderBottom:'1px solid rgba(245,166,35,0.08)',padding:isMobile?'2rem 1rem':'4rem 2rem'}}>
        <div style={{maxWidth:900,margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontSize:'clamp(1.3rem,2.5vw,1.9rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:6,color:'#fff'}}>
            {lang==='ru'?'СКОЛЬКО ВЫ ЗАРАБОТАЕТЕ':lang==='en'?'HOW MUCH CAN YOU EARN':'CÂT POȚI CÂȘTIGA'}
          </h2>
          <div style={{width:40,height:2,background:gold,margin:'0 auto 20px',borderRadius:2}}/>
          <p style={{fontSize:13,color:'rgba(255,255,255,0.35)',marginBottom:28}}>
            {lang==='ru'?'Реальный пример для блогера с 50 000 подписчиков':lang==='en'?'Real example for a blogger with 50,000 followers':'Exemplu real pentru un blogger cu 50.000 urmăritori'}
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:24}}>
            {[
              [lang==='ru'?'Переходов/месяц':lang==='en'?'Clicks/month':'Clickuri/lună','~1.000','rgba(148,163,184,0.9)'],
              [lang==='ru'?'Новых игроков':lang==='en'?'New players':'Jucători noi','~25-40','#60a5fa'],
              [lang==='ru'?'Активных игроков':lang==='en'?'Active players':'Jucători activi','~8-15','#a78bfa'],
              [lang==='ru'?'Доход в месяц':lang==='en'?'Monthly income':'Venit lunar','$150-500',gold],
            ].map(([label,val,color])=>(
              <div key={label} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'1.1rem'}}>
                <div style={{fontSize:isMobile?20:28,fontWeight:900,color,marginBottom:5}}>{val}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',lineHeight:1.4}}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.15)',borderRadius:8,padding:'12px 18px',fontSize:13,color:'rgba(255,255,255,0.5)',maxWidth:580,margin:'0 auto',lineHeight:1.7}}>
            💡 {lang==='ru'?'Игроки привязаны к тебе навсегда — даже если ты перестанешь публиковать, комиссия продолжает идти.':lang==='en'?'Players are tied to you forever — even if you stop posting, the commission keeps coming.':'Jucătorii rămân legați de tine pe viață — chiar dacă nu mai postezi, comisionul continuă să vină.'}
          </div>
        </div>
      </div>

      {/* ─── BENEFITS ─── */}
      <div style={{maxWidth:1200,margin:'0 auto',padding:isMobile?'2.5rem 1rem':'5rem 2rem'}}>
        <div style={{textAlign:'center',marginBottom:'3rem'}}>
          <h2 style={{fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.ben_title}</h2>
          <div style={{width:40,height:2,background:gold,margin:'12px auto 0',borderRadius:2}}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
          {benefits.map(([Icon,title,desc,iconColor])=>(
            <div key={title} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'1.4rem 1.5rem',display:'flex',gap:16,transition:'border-color .2s,background .2s',cursor:'default',borderLeft:`3px solid ${iconColor}30`}} onMouseOver={e=>{e.currentTarget.style.borderColor=`${iconColor}40`;e.currentTarget.style.background='rgba(255,255,255,0.03)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';e.currentTarget.style.background='rgba(255,255,255,0.02)'}}>
              <div style={{width:44,height:44,background:`${iconColor}12`,border:`1px solid ${iconColor}25`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Icon/>
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:'rgba(255,255,255,0.9)',marginBottom:5}}>{title}</div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',lineHeight:1.65}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MANAGER PERSONAL ─── */}
      <div style={{background:'rgba(0,0,0,0.45)',padding:isMobile?'3rem 1.25rem':'5rem 2rem',borderTop:`1px solid rgba(245,166,35,0.07)`,borderBottom:`1px solid rgba(245,166,35,0.07)`}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
            <h2 style={{fontSize:'clamp(1.3rem,3vw,2rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.mgr_title}</h2>
            <div style={{width:40,height:2,background:gold,margin:'12px auto 0',borderRadius:2}}/>
          </div>
          <div style={{background:'rgba(245,166,35,0.04)',border:`1px solid rgba(245,166,35,0.15)`,borderRadius:16,padding:isMobile?'1.5rem':'2.5rem',display:'flex',gap:isMobile?16:32,alignItems:'center',flexDirection:isMobile?'column':'row'}}>
            <div style={{flexShrink:0,textAlign:'center'}}>
              <div style={{width:isMobile?84:104,height:isMobile?84:104,borderRadius:'50%',background:'linear-gradient(135deg,#1a1a2e,#0f0f1a)',border:`2px solid ${gold}`,overflow:'hidden',margin:isMobile?'0 auto':'0'}}>
                <svg viewBox="0 0 108 108" style={{width:'100%',height:'100%'}}>
                  <rect width="108" height="108" fill="url(#avatarBg)"/>
                  <defs>
                    <radialGradient id="avatarBg" cx="50%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="#1e1e35"/>
                      <stop offset="100%" stopColor="#0a0a15"/>
                    </radialGradient>
                  </defs>
                  <ellipse cx="54" cy="95" rx="30" ry="20" fill="rgba(245,166,35,0.15)"/>
                  <ellipse cx="54" cy="92" rx="22" ry="16" fill="#f5a623" opacity="0.9"/>
                  <circle cx="54" cy="42" r="20" fill="#f5a623" opacity="0.95"/>
                  <circle cx="54" cy="44" r="18" fill="rgba(0,0,0,0.08)"/>
                  <circle cx="47" cy="40" r="3" fill="#1a1000"/>
                  <circle cx="61" cy="40" r="3" fill="#1a1000"/>
                  <circle cx="48" cy="39" r="1" fill="rgba(255,255,255,0.5)"/>
                  <circle cx="62" cy="39" r="1" fill="rgba(255,255,255,0.5)"/>
                  <path d="M46,48 Q54,55 62,48" stroke="#1a1000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  <path d="M38,88 L50,72 L54,78 L58,72 L70,88" fill="#0d0d20" opacity="0.9"/>
                  <path d="M50,72 L54,82 L58,72" fill={gold} opacity="0.6"/>
                  <circle cx="82" cy="26" r="11" fill={gold}/>
                  <text x="82" y="31" textAnchor="middle" fontSize="9" fontWeight="900" fill="#000">W</text>
                </svg>
              </div>
              <div style={{marginTop:10,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:'#10b981',boxShadow:'0 0 6px #10b981'}}/>
                <span style={{fontSize:11,color:'#10b981',fontWeight:700}}>Online</span>
              </div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:isMobile?16:19,fontWeight:900,color:'#fff',marginBottom:3}}>{t.mgr_name}</div>
              <div style={{fontSize:12,color:gold,fontWeight:600,marginBottom:14,letterSpacing:'.06em',textTransform:'uppercase'}}>{t.mgr_role}</div>
              <p style={{fontSize:14,color:'rgba(255,255,255,0.6)',lineHeight:1.75,marginBottom:18}}>{t.mgr_text}</p>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                <a href="https://t.me/winpartners_manager" target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',background:gold,color:'#000',border:'none',borderRadius:7,fontSize:13,fontWeight:700,cursor:'pointer',textDecoration:'none'}}>
                  <span>✈️</span> {t.mgr_btn}
                </a>
                <div style={{display:'flex',alignItems:'center',gap:6,padding:'10px 14px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:7}}>
                  <span style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>🔒 {t.mgr_verify}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <div style={{background:'rgba(0,0,0,0.3)',padding:isMobile?'2.5rem 1rem':'5rem 2rem',borderTop:`1px solid rgba(245,166,35,0.07)`}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <h2 style={{fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.how_title}</h2>
            <div style={{width:40,height:2,background:gold,margin:'12px auto 0',borderRadius:2}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:0,position:'relative'}}>
            {!isMobile && <div style={{position:'absolute',top:27,left:'12.5%',right:'12.5%',height:1,background:`linear-gradient(90deg,${gold},rgba(245,166,35,0.15))`,zIndex:0}}/>}
            {[[t.hw1,'01'],[t.hw2,'02'],[t.hw3,'03'],[t.hw4,'04']].map(([title,num])=>(
              <div key={num} style={{textAlign:'center',padding:'1.5rem 1rem',position:'relative',zIndex:1}}>
                <div style={{width:54,height:54,borderRadius:'50%',background:dark,border:`2px solid ${gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,color:gold,margin:'0 auto 14px',boxShadow:`0 0 20px rgba(245,166,35,0.15)`}}>{num}</div>
                <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.8)',lineHeight:1.4}}>{title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CASINO PARTNERS ─── */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:isMobile?'2.5rem 1rem':'5rem 2rem'}}>
        <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
          <h2 style={{fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.cas_title}</h2>
          <div style={{width:40,height:2,background:gold,margin:'12px auto 0',borderRadius:2}}/>
        </div>
        <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
          {casinos.map(c=>(
            <div key={c.name} style={{background:c.bg,border:`1px solid ${c.color}25`,borderRadius:12,padding:'1rem 1.75rem',display:'flex',alignItems:'center',gap:12,minWidth:150,transition:'border-color .2s,transform .15s'}} onMouseOver={e=>{e.currentTarget.style.borderColor=`${c.color}55`;e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.borderColor=`${c.color}25`;e.currentTarget.style.transform='translateY(0)'}}>
              <div style={{width:36,height:36,borderRadius:8,background:c.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,color:'#fff'}}>{c.icon}</div>
              <span style={{fontSize:16,fontWeight:700,color:'#fff'}}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TESTIMONIALS ─── */}
      <div style={{background:'rgba(0,0,0,0.4)',padding:isMobile?'2.5rem 1rem':'5rem 2rem',borderTop:`1px solid rgba(245,166,35,0.07)`}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <h2 style={{fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em'}}>{t.test_title}</h2>
            <div style={{width:40,height:2,background:gold,margin:'12px auto 0',borderRadius:2}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fit,minmax(260px,1fr))',gap:20}}>
            {[
              [t.t1n, t.t1p, t.t1t, gold],
              [t.t2n, t.t2p, t.t2t, '#60a5fa'],
              [t.t3n, t.t3p, t.t3t, '#10b981'],
            ].map(([name, platform, text, accentColor])=>(
              <div key={name} style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'1.75rem',position:'relative',overflow:'hidden'}}>
                {/* Decorative quote mark */}
                <div style={{position:'absolute',top:12,right:16,fontSize:64,color:`${accentColor}10`,fontFamily:'Georgia,serif',lineHeight:1,pointerEvents:'none',userSelect:'none'}}>"</div>
                <StarRating/>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.6)',lineHeight:1.8,marginBottom:16,position:'relative'}}>{text}</p>
                <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:12}}>
                  <div style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.85)'}}>{name}</div>
                  <div style={{fontSize:11,color:accentColor,fontWeight:600,marginTop:2,textTransform:'uppercase',letterSpacing:'.05em'}}>{platform}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CALCULATOR ─── */}
      <CalcSection isMobile={isMobile} lang={lang} navigate={navigate} gold={gold} />

      {/* ─── CTA ─── */}
      <div style={{padding:isMobile?'3rem 1rem':'6rem 2rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 65% 75% at 50% 50%, rgba(245,166,35,0.07) 0%, transparent 68%)`,pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <h2 style={{fontSize:'clamp(1.8rem,4vw,2.8rem)',fontWeight:900,textTransform:'uppercase',letterSpacing:'.03em',marginBottom:12}}>{t.cta_title}</h2>
          <p style={{fontSize:15,color:'rgba(255,255,255,0.45)',marginBottom:36,maxWidth:480,margin:'0 auto 36px'}}>{t.cta_sub}</p>
          <button onClick={()=>navigate('/register')} style={{padding:'17px 56px',fontSize:15,fontWeight:800,cursor:'pointer',border:`2px solid ${gold}`,borderRadius:6,background:gold,color:'#000',textTransform:'uppercase',letterSpacing:'.05em',boxShadow:`0 8px 36px rgba(245,166,35,0.28)`,transition:'box-shadow .2s,transform .15s'}} onMouseOver={e=>{e.currentTarget.style.boxShadow='0 12px 48px rgba(245,166,35,0.42)';e.currentTarget.style.transform='translateY(-2px)'}} onMouseOut={e=>{e.currentTarget.style.boxShadow='0 8px 36px rgba(245,166,35,0.28)';e.currentTarget.style.transform='translateY(0)'}}>{t.cta_btn}</button>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer style={{background:'#050508',borderTop:`1px solid rgba(245,166,35,0.09)`,padding:isMobile?'2rem 1.25rem 1.5rem':'3rem 3rem 2rem'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'1fr auto auto auto',gap:isMobile?20:48,marginBottom:24}}>
            <div style={{gridColumn:isMobile?'1 / -1':'auto'}}>
              <div style={{fontSize:18,fontWeight:900,marginBottom:10}}><span style={{color:'#fff'}}>WIN</span><span style={{color:gold}}>PARTNERS</span></div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.28)',lineHeight:1.7,maxWidth:240}}>{lang==='ru'?'Профессиональная партнёрская платформа для блогеров и инфлюенсеров.':lang==='en'?'Professional affiliate platform for bloggers and influencers worldwide.':lang==='tr'?'Blogger ve içerik üreticileri için profesyonel ortaklık platformu.':lang==='de'?'Professionelle Affiliate-Plattform für Blogger und Influencer.':lang==='pt'?'Plataforma profissional de afiliados para bloggers e influenciadores.':lang==='pl'?'Profesjonalna platforma partnerska dla blogerów i influencerów.':'Platformă profesională de afiliere pentru bloggeri și influenceri.'}</div>
              <div style={{display:'flex',gap:6,marginTop:14,flexWrap:'wrap'}}>
                {[t.f_ssl, t.f_lic, t.f_rating].map(b=><span key={b} style={{fontSize:11,color:'rgba(255,255,255,0.3)',background:'rgba(255,255,255,0.04)',padding:'3px 8px',borderRadius:4}}>{b}</span>)}
              </div>
            </div>
            {[
              [t.f_prog,
                ['about', t.nav_about],
                ['benefits', t.nav_ben],
                ['instructions', t.nav_how],
                ['faq', t.nav_faq]],
              [t.f_comp,
                ['about', t.nav_about],
                ['contact', t.nav_contact],
                ['terms', t.f_terms],
                ['terms', t.f_priv]],
              ['Contact',
                ['','support@winpartners.partners'],
                ['','Telegram: @winpartners_manager'],
                ['',t.f_wa],
                ['','24/7']],
            ].map(([title,...links])=>(
              <div key={title}>
                <div style={{fontSize:11,fontWeight:700,color:gold,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:12}}>{title}</div>
                {links.map(([path,label])=>(
                  <div key={label} onClick={path?()=>navigate('/'+path):undefined} style={{fontSize:13,color:'rgba(255,255,255,0.35)',marginBottom:8,cursor:path?'pointer':'default',transition:'color .15s'}} onMouseOver={e=>path&&(e.target.style.color='rgba(255,255,255,0.65)')} onMouseOut={e=>path&&(e.target.style.color='rgba(255,255,255,0.35)')}>{label}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:18,textAlign:'center',fontSize:12,color:'rgba(255,255,255,0.18)'}}>{t.f_copy}</div>
        </div>
      </footer>
    </div>
  )
}
