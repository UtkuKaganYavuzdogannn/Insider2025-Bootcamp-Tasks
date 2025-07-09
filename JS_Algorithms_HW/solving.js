function collatzZincirUzunlugu(sayi) 
{
  let sayac = 1;

  while (sayi !== 1) 
    {

    if (sayi % 2 === 0) {
      sayi = sayi / 2;
    } else {
      sayi = 3 * sayi + 1;
    }
    sayac++;

   }

  return sayac;
}

let enUzunZincir = 0;
let baslangicSay = 0;

for (let i = 1; i < 1000000; i++) 
{
  let uzunluk = collatzZincirUzunlugu(i);

  if (uzunluk > enUzunZincir) 
    {
    enUzunZincir = uzunluk;
    baslangicSay = i;
    }
}

console.log("En uzun zinciri üreten başlangıç sayısı:", baslangicSay);
console.log("Zincirin uzunluğu:", enUzunZincir);
