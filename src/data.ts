import { MenuItem } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'margherita-rustica',
    name: 'Margherita Rústica',
    description: 'Nuestra masa madre de 48 horas, salsa de tomates San Marzano triturados a mano, mozzarella de búfala fresca, albahaca recién cosechada y un toque de aceite de oliva extra virgen.',
    price: 45.00,
    category: 'Clásicas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmEMjd4R_MSXWOXC1bLYZEBmyncYlkkil4C8pajjtx6ZQG-kvngWbnhg_roVO7gs92GIAxH5T-_wK3t8zwuLmY3EQnHUzRjcXI6_voVFn8PX7oGm9FPnHd-gORe2sCbFFmIltWgqq-YR_rx9sj4HWQaA40yDlW1iy8sFipmFZiOmHJr-asELAdeLi1GdbNEAxv5YacJKU3mZ8Uk2gzIoMDLZx6C9MaX614B53KLPFlbWuSJtbkeqp079j6U2Bs8o9HItZjBMXTuEo',
    isPopular: true
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    description: 'Extra pepperoni y extra queso mozzarella fundido sobre nuestra salsa de tomate artesanal.',
    price: 25.00,
    category: 'Clásicas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApqcjK_Rp7uzHFuqAzbm_xHmu4_TSD8AL56FkK8uDrH7zRzzZlfYveF_WxOqIazSy6a17R0ZUnUZDMtHGJxTQo63iJ5Wv-dd-BWfZASPRCySoR94B70_M6aVtzztodgZNx3D8dAztYYmbYDOjFi8_nBLPsrr_SMq-WCerUYYRHbUF7rH0Ryx483A6HycZVTOfZlli9vvBMjw0lDZAlL7OcbtktdUIBKpr0vUqctJTChw6lV8OhLdZ-goiU_x2IYN4XTfnzDlzHiRw',
    isPopular: true
  },
  {
    id: 'hawaiana',
    name: 'Hawaiana',
    description: 'Jugosa piña en cubos, jamón ahumado y extra queso mozzarella. El clásico contraste dulce y salado.',
    price: 27.00,
    category: 'Clásicas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIDvwe0j6mcW6HwE6G-V8G5Xrevpl9CqlOvuCj2VvyAoNvka2kQjnOusFPP5Q9_duSZyWJpTI4yLiVhjxiPVNNQXbLHABLCjDaq8z081crumRnYEWWbs4IAUPwPGKa_5x2ZffG5VqfGMihfnkgsoYio-INwgTCVBPuSsh3TYYipPShkXznaVXmFAxlDPCHahMoJ7ll6D_O7XFX6mhohMtpSlQVn0P_0ewn44NroPVVJ1pganiuskhRLOKTezwwq6iFr5XlTvwhgGI'
  },
  {
    id: 'margherita-classica',
    name: 'Margarita Classica',
    description: 'Tomates frescos, mozzarella de búfala, albahaca fresca y un toque de aceite de oliva extra virgen.',
    price: 25.00,
    category: 'Clásicas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0R8aYd4lCRIKQ-UsHPnBTfGj6YiV-H5HyVoTtFkQoEXf7skj8wquQjrgS4Z7Da-A2EtAPh2wsJrGKLzirV63JLDwEJEGur5IzBhY28vcgWeyGphThAwpAYeLp0nj7BNaJMC_ekIliE_NeVDDW6SyV0938oHdZ1t6auG8Jw4W565e0zoAJSKW5mUDvtcepaMqFbtM13iPg6Y_zMpDzlrY84hlTyyO5pZ3_nqbsh2NpnObuOT-NJJMHVDGTlL1x6vhLc9HJzIE0o_8'
  },
  {
    id: 'todas-las-carnes',
    name: 'Todas las Carnes',
    description: 'Pepperoni, jamón, carne molida, tocino crujiente y salchicha italiana. Para los más carnívoros.',
    price: 35.00,
    category: 'Especialidades',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhkF7fqNtbd7f3t8S615S_Dy_27ii9IoJ74m-FzHtJcMhLtRysdbRUs3uEmFj4K6A3DYcNgQMImHRhT1Hr0aiuB_uVwaqbF0YbEZHPke0R4fcUFl7Y1RXBJ9d4ort7KL8EwoSIgUYB1HUqn-SkJaqAEoOAXsIPcOpbQFur2tVfT8rNJn70s3vvaoZkYCjb-uSqqUpUReuePfVFnHcjZzSweoFmCDZbSoVNIsI9KtsZ4EIqvd_3SQOXPmCE6nFoFLtw7f7InRh6iOE',
    isNew: true
  },
  {
    id: 'veggie-delight',
    name: 'Veggie Delight',
    description: 'Familiar Veggie Pizza cargada de pimientos, cebollas rojas, champiñones, aceitunas negras y queso premium.',
    price: 42.50,
    category: 'Vegetarianas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4IBFoMs3wt9NYEtmu1ltqMWRTBWW1u-yEpCcBLTcFB8Prpe_csP6QAo0IYnQXQCiA6Oq45llDE7UDWOHtYmEn4gTh4OnuOBefi-letHv4yxGMN49QVzuArCKJC5aKV32c7IBfosqjcnGcORZ0rX40N-NJ7G3bmTnvjENJS_LIebu4y2BsgUB1ujodZ94XuH4rEd2acaHiD5V9Z_Fkbbj9eYSKzbw5E0uA2gQcKFtZwXlWTRCw8MSYqQSbB8z_H0b0lIQCVLId3sk'
  },
  // Complementos
  {
    id: 'garlic-knots',
    name: 'Nudos de Ajo (6 und)',
    description: 'Nudos de pan recién horneados, bañados en aceite de ajo artesanal, finas hierbas y queso parmesano rallado.',
    price: 12.00,
    category: 'Complementos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbntqkmswdfoS6O87aV5MkYJnLi2SAZDDow4pZq9AyxuLXuwxJRw4UJ09rbRs1PH8f88sK6Z-TddStRW3jyubpNmI1UNTPo6SLKOojyQuYV7wjnHZ7gtPDmPLhPaLiVGWOnl4p7XuqSbTHCCN0c51aOkPmgdpWF3As7Qlr4Ka8iGvNolbnBH3pVo32TAbaYek3fbh1fhO99PhwUdwWAjPDeBQjCIxXIjEe2UgWYtrp2t-KdKUrvHyB3wq8Mhkauh8tED3J9GBNxak'
  },
  {
    id: 'pan-de-ajo',
    name: 'Pan de Ajo Rústico',
    description: 'Crujientes rebanadas de pan artesanal frotadas con ajo fresco, aceite de oliva y hierba buena.',
    price: 10.00,
    category: 'Complementos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzjmS3a20o-LJLA-za5PARg6SCBJY8pwW3ZJ9q1Zd5JB1VpBuRCH_vO5kcZM43SkMS0aFiEKEE4CvWCpeSkgbA6ozEqzwMhOW3h1vTEKYQV7J7G4PSeZ2XaXstIO5GuZ5IR5hMxQwivCQ9u_cA6Cx-_NjjWWSJz2pFM48RNwRvFlQLxauhcMRef49IxcyWSSJCOc8Pj72GP0Vj6mOEpuc7X2EqM8JNr7NWQBk9XBBR0dGBzeX5m1h21AVzerO0E7yYUE71LBuW_IQ'
  },
  // Bebidas
  {
    id: 'artisan-lemonade',
    name: 'Limonada de Hierbas 500ml',
    description: 'Nuestra bebida helada insignia hecha con limones reales exprimidos al momento y hojas de menta orgánica.',
    price: 12.00,
    category: 'Bebidas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwTJzwZigputMGW3tJzjmXxzMoAASK4zBgooPe95sslg10-OVp_Mhv3GWBpYTUL3w3SdNgMFuZd4sNtYJ9_uD2ZbUFojzkpCNC4G2kFj1nMbH9HGjiAopinxIc_al5g4QTeGfE2TuAhF5bj0fhaL1jOjLCEYByuTVL3BWWzEhhHgcwPPuPjnUnMLPOV9DPuUEftOqifyf7twi7nCgDhbLhWKUMNk7ssapTOYDw8m43z1XD1RT7L_8L12lNtxn2N6rZqVfMf5ipVQU'
  },
  // Postres
  {
    id: 'fudge-brownie',
    name: 'Brownie de Chocolate Rústico',
    description: 'Increíble brownie de chocolate puro cubierto con una bola de helado de vainilla fundiéndose.',
    price: 15.00,
    category: 'Postres',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXzNwkod4Pk5uIZgEjPV2DNKWLoanB6caDbvyLp1H6dB6h_OSPTlDvAOJiEWwkHWXFumCvoH7E6F_c34hA0mKt8EKWT3zwYY0mWwgdR3eaLcZu7LVKBqU-yhknGc5tmW2tWt5w1lbNWQgv8Ngwpvw4947FZg9Y1C2pHRQvbbEDC0RHtdWhorTxHefOupiDJE8ktsgJxxD--WcGzMATeXv5dN2GtSMhntq9-NTh25fU-cuTpbQX8z0R3fQrK5SadTbxEtbcf5TkY9w'
  }
];

export interface Offer {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  badge?: string;
  category: 'Combos Familiares' | 'Individuales' | 'Vegetarianas' | 'Sin Gluten';
}

export const OFFERS: Offer[] = [
  {
    id: 'duo-dinamico',
    name: 'Dúo Dinámico',
    description: '2 Pizzas Medianas (Especialidad a elegir) + 2 Bebidas Medianas.',
    price: 24.99,
    originalPrice: 38.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbHuJKrzUvswBeNFb6JSME7hnGSfbxtDRGHecHTM05YHAtT2D-oZ2bpLG7TDlB1qzbBF_KmfF8rmikF_6Ki2NrO91h4zHhZDUvtCik49KSwLhTVIYyPMegqRX97HTYiMJ3-zjbC-Dcs-SkHtpZ058eCHmih4ss1VPaGmhNcI0aGvsFdvxLd9slkSKZykcQipMRFIdC7WcbGVN7c7AnjxxO5Id0bg7jP7KLggQye7KkU-yLF8DMb4f29_OXtbhnjbnaEY9zmqHRmN0',
    badge: 'POPULAR',
    category: 'Combos Familiares'
  },
  {
    id: 'festin-familiar',
    name: 'Festín Familiar',
    description: '1 Pizza Familiar + 12 Nudos de Ajo + Ensalada Familiar + Bebida 2L.',
    price: 35.99,
    originalPrice: 52.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1cfSuGS-XAUsBIwnd_hhVF_h_9uofhqaJN5XC0lkAJHncV_C3yLTpxyzC2TplSk65oIMeBtXjUjSGGGScg9-ZAPi9sL7gZcE9mMY1VNE4EGv3mSN1JvKRioSJ08hFNXLwB5JPaw5LHQZIr6JI2ExaSwaBLl2OJLDr-ZI_s2Nz2h6HyUUyov-a9d6xcAka1UDzvnwMNqCkU2UyiKupxaAlBRIfwar7H91LkBP_Nugc7ZRe6PIqVN2pmEZ6ELct7pxlYyVkNty37wE',
    badge: 'MEGA AHORRO',
    category: 'Combos Familiares'
  },
  {
    id: 'almuerzo-mikes',
    name: "Almuerzo Mike's",
    description: '1 Pizza Personal (2 Ingredientes) + Refresco o Té Natural.',
    price: 12.50,
    originalPrice: 18.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAjM2_INzs6lcDJiIetwgekn4VOp0vwUirrINSnCeQWTqlySwJingd_e9yCyAd_KJ_Sh6GpCQR3L2KPCjkmhtpMXHnLvlo4ONg-Zxauc0ih5I19NA8kn2OBNnFkrKmUGtwBrFJu3QvhgB0nDcZo_Gh0uh93RKqpiDfYaNWkxoWSRep-vWWza1wKH7FS-WRRxbomGbQrGecVEnEsFSomR2F_NgKDy5noaXNxKpHjgh1ZGA2-GNznASPw12EVB1Zs1AftNoco9mrzmM',
    badge: 'LUN-VIE',
    category: 'Individuales'
  },
  {
    id: 'combo-dulce-final',
    name: 'Combo Dulce Final',
    description: 'Pide cualquier pizza familiar y lleva una Pizza Dulce de Frutos Rojos de cortesía por un precio especial.',
    price: 7.99,
    originalPrice: 15.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkyROQ2a57d_bKzhoYTPbviGIlGlMtAtsz7HtUQg5IeqGx8UOHUVk8Ns6Yup9_k-6Upo63sovPgqPnkXOCDxPWHaQcQCE2ykZCLg6aypDKAMZ2gYtS2WVQC3WOLM65MzvMXqWtNBaENJMkJACVJAOxF14pGXy4DsqZl-e2zX-tk3XeKSHLiwW8ko3g6-rMQDN6tF-1jnIpf-kMu82_yM5HnjTPO0a3fhvnhqxRSKnqKAXHpJQv19eaxxCiMMm8i8NSsmYAOg8rD6w',
    category: 'Individuales'
  },
  {
    id: 'trio-especialidades',
    name: 'Trío de Especialidades',
    description: '3 Pizzas Medianas Especiales. Prueba nuestros mejores sabores cargados de pasión.',
    price: 39.99,
    originalPrice: 54.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiEHI-3gokM_aXR1RCD0dXhlpb0AeU672INJJtWdDP9k9S7RJXq4vLY5qhaCj8grVTGiByuJVElME7POF61SgQl1SgM01itMdG0SNMT3tChseFDtW34p8Z04u8keU1RlhTD7VvED_YE2Sc4bqObXkDW5bS2V0rRGehxwHKdF0euKSSLuKK65vXMnixCNepA-zsrQFzA3Szaopm2v5NWB_DdM4CNxn1Fif0EhIOl0Yjb3XYq-cGRDrPt-UUgNA69LjEx7BGi34FqI8',
    badge: 'NUEVO',
    category: 'Combos Familiares'
  },
  {
    id: 'super-xl-tradicional',
    name: 'Super XL Tradicional',
    description: 'Nuestra pizza más grande. 16 rebanadas de pura frescura artesanal y abundancia.',
    price: 19.99,
    originalPrice: 28.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjvnZmkOC1TrX6AuU8K8WELzS8bshNmepygaXI8zDE2O_cQFpgEDFjMl2u9bK6Pp9DNY39GMmMvn3VDQ01u2XVjRyWkMyXwQm5jottPtUwBy3eiTf3_bqBDLat_QVxEAAsvA7wCznzI6-XWIuF4E18cg0QoCd69W6aPwWjjhWZuOTJOVjAGzZfJ8ekChrOqTVKij8A-WpWlXuYbiy9W48P8XxtVOPK0DyDRSwmpNqSaWfSTCimIWb3IUhDQx11aFwbScuBIMfA-7I',
    category: 'Sin Gluten'
  }
];
