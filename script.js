const K={akun:'kop_akun',user:'kop_user',cart:'kop_cart',orders:'kop_orders',spp:'kop_spp',login:'kop_login'};
const get=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}};
const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const $=s=>document.querySelector(s);
const rp=n=>'Rp '+n.toLocaleString('id-ID');
const gbr=p=>`<img src="${p.foto}" alt="" onerror="this.parentNode.classList.add('nofoto');this.remove()">`;
const tgl=()=>new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});

/* ====== DATA (ubah di sini) ====== */
const SEKOLAH='SMK Muthia Harapan Cicalengka';
const TA='2026/2027', NOMINAL_SPP=150000;
const BULAN=['Juli','Agustus','September','Oktober','November','Desember','Januari','Februari','Maret','April','Mei','Juni'];
/* ====== FOTO & LOGO (ganti nama file di sini) ====== */
const LOGO='logo.jpg';
const FOTO_PROFIL='gambar/profil.jpg';
const logoHtml=()=>`<img src="${LOGO}" alt="Logo koperasi" onerror="this.replaceWith('K')">`;
const PRODUK=[
 {id:1,nama:'Jas Almamater',harga:350000,ukuran:true,foto:'almet.jpg'},
 {id:2,nama:'Seragam Putih Perempuan',harga:150000,ukuran:true,foto:'sece.jpg'},
 {id:3,nama:'Seragam Putih Laki-Laki',harga:100000,ukuran:true,foto:'seco.jpg'},
 {id:4,nama:'Rok Abu-Abu',harga:150000,ukuran:true,foto:'rok.jpg'},
 {id:5,nama:'Celana Abu-Abu',harga:150000,ukuran:true,foto:'celana.jpg'},
 {id:6,nama:'Pramuka Perempuan',harga:200000,ukuran:true,foto:'prace.jpg'},
 {id:7,nama:'Pramuka Laki-Laki',harga:150000,ukuran:true,foto:'praco.jpg'},
 {id:8,nama:'Baju Batik Laki-Laki',harga:200000,ukuran:true, foto:'batikco.jpg'},
 {id:9,nama:'Baju Batik Perempuan',harga:250000,ukuran:true,foto:'batikce.jpg'},
 {id:10,nama:'Baju Praktik Jurusan',harga:250000,ukuran:true,jurusan:true,foto:'jurusan.jpg'},
 {id:11,nama:'Olahraha Perempuan',harga :250000,ukuran:true,foto:'olgace.jpg'},
 {id:12,nama:'Olahraga Laki-Laki',harga:200000,ukuran:true,foto:'olgaco.jpg'},
 {id:13,nama:'Atribut, Topi, Dasi, Ikat Pinggang',harga:150000,foto:'atribut.jpg'}];
const UNGGULAN=[1,13,10]; /* nomor produk yang tampil di beranda ("Produk yang sering dibeli") */
const UKURAN=['S','M','L','XL','XXL'];
const JURUSAN=['TSM','RPL'];
const STATUS=['Pesanan diterima','Sedang dikemas','Siap diambil','Selesai'];
const MENU=[['beranda','Beranda'],['produk','Produk'],['spp','SPP'],['profil','Profil']];
/* akun siswa disimpan per NIS; sesi = NIS yang sedang masuk */
const akun=()=>get(K.akun,{});
const sesi=()=>{const v=get(K.login,false);return typeof v==='string'?v:null};
const kc=()=>'kop_cart_'+sesi(), ko=()=>'kop_orders_'+sesi();
const user=()=>akun()[sesi()]||{nama:'',nis:'',kelas:'',jurusan:''};
function simpanUser(d){const a=akun(),lama=sesi(),baru={...a[lama],...d};
 if(baru.nis!==lama){delete a[lama];set(K.login,baru.nis)}
 a[baru.nis]=baru;set(K.akun,a)}
/* data SPP disimpan per siswa (NIS + nama): kalau NIS atau nama berubah, dianggap siswa baru dan belum bayar */
const sppBaru=()=>BULAN.map((b,i)=>({bulan:b+' '+(i<6?2026:2027),lunas:false}));
const idSiswa=()=>{const u=user();return u.nis+'|'+u.nama.trim().toLowerCase()};
function sppSemua(){const d=get(K.spp,{});return Array.isArray(d)?{}:d}
const sppData=()=>sppSemua()[idSiswa()]||sppBaru();
function simpanSpp(s){const d=sppSemua();d[idSiswa()]=s;set(K.spp,d)}

/* ====== UMUM ====== */
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),2200)}
function keluar(){localStorage.removeItem(K.login);location.href='login.html'}
const jmlKeranjang=()=>Object.values(get(kc(),{})).reduce((a,b)=>a+b,0);
function perbaruiJml(){const e=$('#jml');if(e)e.textContent=jmlKeranjang()}
function init(aktif){
 const masuk=sesi()&&akun()[sesi()],fu=user().foto||FOTO_PROFIL;
 if(aktif==='login'||aktif==='daftar'){if(masuk)location.replace('beranda.html');return}
 if(!masuk){location.replace('login.html');return}
 $('#nav').innerHTML=`<header class="nav"><a class="brand" href="beranda.html"><span class="logo">${logoHtml()}</span><span>Koperasi<br>${SEKOLAH}</span></a>
 <button class="burger" aria-label="Menu" onclick="this.parentNode.classList.toggle('buka')">☰</button>
 <nav>${MENU.map(([f,t])=>`<a href="${f}.html" class="${f===aktif?'aktif':''}">${t}</a>`).join('')}</nav>
 <div class="kanan"><a class="keranjang ${aktif==='keranjang'?'aktif':''}" href="keranjang.html">Keranjang <b id="jml">${jmlKeranjang()}</b></a>
 ${fu?`<a href="profil.html" aria-label="Profil"><img class="mini" src="${fu}" alt="" onerror="this.parentNode.remove()"></a>`:''}
 <button class="btn kecil garis-btn" onclick="keluar()">Keluar</button></div></header>`;
}
const namaItem=(p,uk,jr)=>p.nama+(jr?' '+jr:'')+(uk?' ('+uk+')':'');
function tambah(id,uk='',jr=''){const c=get(kc(),{}),k=id+'|'+uk+'|'+jr;c[k]=(c[k]||0)+1;set(kc(),c);perbaruiJml();toast('Ditambahkan ke keranjang')}
function pilih(id){
 const p=PRODUK.find(x=>x.id==id);
 if(!p.ukuran&&!p.jurusan)return tambah(id);
 let d=$('#dlgOpsi');if(!d){d=document.createElement('dialog');d.id='dlgOpsi';document.body.append(d)}
 d.innerHTML=`<h2>${p.nama}</h2><p style="color:var(--abu)">${rp(p.harga)}</p>
 ${p.jurusan?`<label class="f" for="opJr">Jurusan</label><select id="opJr">${JURUSAN.map(j=>`<option>${j}</option>`).join('')}</select>`:''}
 ${p.ukuran?`<label class="f" for="opUk">Ukuran</label><select id="opUk">${UKURAN.map(u=>`<option>${u}</option>`).join('')}</select>`:''}
 <div class="tombol"><button class="btn garis-btn" style="color:var(--coklat)" onclick="this.closest('dialog').close()">Batal</button><button class="btn" id="opOk">Tambah ke keranjang</button></div>`;
 $('#opOk').onclick=()=>{tambah(id,p.ukuran?$('#opUk').value:'',p.jurusan?$('#opJr').value:'');d.close()};
 d.showModal();
}
const kartu=p=>`<article class="kartu"><div class="ikon" aria-hidden="true">${gbr(p)}</div><div class="isi"><div><h3 style="font-size:1rem">${p.nama}</h3><div class="harga">${rp(p.harga)}</div></div><button class="btn kecil" onclick="pilih(${p.id})">Tambah ke keranjang</button></div></article>`;

/* ====== LOGIN ====== */
function halamanLogin(){
 $('#form').onsubmit=e=>{e.preventDefault();
  const nis=$('#nis').value.trim(),pw=$('#pw').value,a=akun()[nis],g=$('#galat'),btn=$('#form .btn');
  if(!a||a.pw!==pw){g.textContent='NIS atau kata sandi salah. Belum punya akun? Daftar dulu.';return}
  try{set(K.login,nis)}catch(x){g.textContent='Browser tidak bisa menyimpan data. Buka lewat tombol play di Acode.';return}
  g.textContent='';btn.disabled=true;btn.textContent='Memuat...';
  setTimeout(()=>{btn.disabled=false;btn.textContent='Masuk';g.textContent='Halaman beranda belum terbuka. Cek koneksi, lalu tekan Masuk lagi.'},6000);
  location.href='beranda.html'};
 const logo=$('.logo'),reset=$('#reset');
 const baru=localStorage.getItem('kop_baru');
 if(baru){$('#nis').value=baru;localStorage.removeItem('kop_baru');toast('Pendaftaran berhasil! Silakan masuk.')}
 if(logo)logo.innerHTML=logoHtml();
 if(reset)reset.onclick=e=>{e.preventDefault();const p=reset.parentNode;
  p.innerHTML='Hapus semua akun dan data di perangkat ini?<br><button type="button" class="btn kecil garis-btn" id="rBatal" style="color:var(--coklat);margin:10px 8px 0 0">Batal</button><button type="button" class="btn kecil" id="rYa" style="margin-top:10px">Ya, hapus semua</button>';
  $('#rYa').onclick=()=>{localStorage.clear();location.replace('login.html')};
  $('#rBatal').onclick=()=>location.reload()};
}
function halamanDaftar(){
 const logo=$('.logo');if(logo)logo.innerHTML=logoHtml();
 $('#form').onsubmit=e=>{e.preventDefault();
  const d={},g=$('#galat');
  for(const k of ['nama','nis','kelas','jurusan'])d[k]=$('#'+k).value.trim();
  const pw=$('#pw').value;
  if(Object.values(d).some(v=>!v)){g.textContent='Semua kolom harus diisi.';return}
  if(pw.length<6){g.textContent='Kata sandi minimal 6 karakter.';return}
  const a=akun();if(a[d.nis]){g.textContent='NIS ini sudah terdaftar. Silakan masuk.';return}
  a[d.nis]={...d,pw};set(K.akun,a);
  localStorage.setItem('kop_baru',d.nis);
  $('#form').innerHTML='<p style="text-align:center;font-weight:700;margin:6px 0 16px">Pendaftaran berhasil!</p><a class="btn" style="display:block;text-align:center" href="login.html">Lanjut ke halaman login</a>';
  setTimeout(()=>location.href='login.html',1500)};
}

/* ====== BERANDA ====== */
function halamanBeranda(){
 const u=user(),b=sppData().find(x=>!x.lunas);
 $('#nama').textContent=u.nama.split(' ')[0];
 $('#tagihan').innerHTML=b?`<p>Tagihan SPP berikutnya</p><strong>${b.bulan}</strong><span>${rp(NOMINAL_SPP)}</span><a class="btn kuning" href="spp.html">Bayar SPP</a>`:'<p>Semua tagihan SPP sudah lunas. Terima kasih!</p>';
 $('#unggulan').innerHTML=UNGGULAN.map(id=>PRODUK.find(x=>x.id==id)).filter(Boolean).map(kartu).join('');
}

/* ====== PRODUK ====== */
function halamanProduk(){
 const tampil=()=>{const q=$('#cari').value.toLowerCase().trim();
  const hasil=PRODUK.filter(p=>p.nama.toLowerCase().includes(q));
  $('#daftar').innerHTML=hasil.length?hasil.map(kartu).join(''):`<p class="kosong">Tidak ada produk bernama "${q}".</p>`};
 $('#cari').oninput=tampil;tampil();
}

/* ====== KERANJANG ====== */
function halamanKeranjang(){gambarKeranjang();gambarPesanan()}
const kunciAda=k=>PRODUK.some(x=>x.id==k.split('|')[0]);
const opsiHtml=(k,p,uk,jr)=>{const sel=(idx,label,list,cur)=>`<select aria-label="${label}" onchange="ubahOpsi('${k}',${idx},this.value)"><option value="" disabled ${cur?'':'selected'}>${label}</option>${list.map(v=>`<option ${v===cur?'selected':''}>${v}</option>`).join('')}</select>`;
 return (p.jurusan?sel(2,'Jurusan',JURUSAN,jr):'')+(p.ukuran?sel(1,'Ukuran',UKURAN,uk):'')};
function gambarKeranjang(){
 const c=get(kc(),{}),ks=Object.keys(c).filter(kunciAda);
 let total=0;
 $('#isi').innerHTML=ks.length?ks.map(k=>{const [id,uk,jr]=k.split('|'),p=PRODUK.find(x=>x.id==id),q=c[k];total+=p.harga*q;
  return `<div class="item"><div class="i">${gbr(p)}</div><div><b>${p.nama}</b><div>${rp(p.harga)}</div>
  ${p.ukuran||p.jurusan?`<div class="opsi">${opsiHtml(k,p,uk,jr)}</div>`:''}
  <div class="qty"><button aria-label="Kurangi" onclick="ubah('${k}',-1)">−</button><span>${q}</span><button aria-label="Tambah" onclick="ubah('${k}',1)">+</button></div></div>
  <div style="text-align:right"><b>${rp(p.harga*q)}</b><br><button class="hapus" onclick="hapus('${k}')">Hapus</button></div></div>`}).join(''):'<p class="kosong">Keranjang masih kosong. <a href="produk.html" style="color:var(--coklat);font-weight:700">Lihat produk</a></p>';
 $('#total').textContent=rp(total);
 $('#co').disabled=!ks.length;perbaruiJml();
}
function ubah(k,d){const c=get(kc(),{});c[k]=(c[k]||0)+d;if(c[k]<=0)delete c[k];set(kc(),c);gambarKeranjang()}
function hapus(k){const c=get(kc(),{});delete c[k];set(kc(),c);gambarKeranjang()}
function ubahOpsi(k,idx,v){const c=get(kc(),{}),a=k.split('|');a[idx]=v;const nk=a.join('|');if(nk===k)return;c[nk]=(c[nk]||0)+c[k];delete c[k];set(kc(),c);gambarKeranjang()}
function checkout(){
 const c=get(kc(),{}),ks=Object.keys(c).filter(kunciAda);if(!ks.length)return;
 for(const k of ks){const [id,uk,jr]=k.split('|'),p=PRODUK.find(x=>x.id==id);
  if(p.jurusan&&!jr){toast('Pilih jurusan untuk '+p.nama);return}
  if(p.ukuran&&!uk){toast('Pilih ukuran untuk '+p.nama);return}}
 const item=ks.map(k=>{const [id,uk,jr]=k.split('|'),p=PRODUK.find(x=>x.id==id);return {nama:namaItem(p,uk,jr),q:c[k],harga:p.harga}});
 const o=get(ko(),[]);
 o.unshift({id:'KOP-'+Date.now().toString().slice(-6),tanggal:tgl(),item,total:item.reduce((a,i)=>a+i.q*i.harga,0),status:0});
 set(ko(),o);set(kc(),{});gambarKeranjang();gambarPesanan();toast('Checkout berhasil!');
}
function gambarPesanan(){
 const o=get(ko(),[]);
 $('#pesanan').innerHTML=o.length?o.map((x,i)=>`<div class="pesanan"><header><b>${x.id}</b><span>${x.tanggal} · ${rp(x.total)}</span></header>
 <div class="langkah">${STATUS.map((s,j)=>`<div class="${j<=x.status?'on':''}">${s}</div>`).join('')}</div>
 <p style="font-size:.88rem;color:var(--abu);margin-bottom:10px">${x.item.map(i=>i.nama+' ×'+i.q).join(', ')}</p>
 ${x.status<3?`<button class="btn kecil" onclick="lanjut(${i})">Simulasikan status berikutnya</button>`:'<span class="badge lunas">Pesanan selesai</span>'}</div>`).join(''):'<p class="kosong">Belum ada pesanan.</p>';
}
function lanjut(i){const o=get(ko(),[]);if(o[i].status<3)o[i].status++;set(ko(),o);gambarPesanan()}

/* ====== SPP ====== */
let dipilih=null;
function halamanSpp(){
 const u=user();
 $('#info').innerHTML=[['Nama',u.nama],['Kelas',u.kelas],['NIS',u.nis],['Jurusan',u.jurusan]].map(([k,v])=>`<div><span>${k}</span><b>${v}</b></div>`).join('');
 gambarSpp();
}
function gambarSpp(){
 const s=sppData();
 $('#tagihan').innerHTML=s.map((x,i)=>`<tr><td>${x.bulan}</td><td>${rp(NOMINAL_SPP)}</td><td><span class="badge ${x.lunas?'lunas':'belum'}">${x.lunas?'Sudah bayar':'Belum bayar'}</span></td>
 <td>${x.lunas?'—':`<button class="btn kecil" onclick="bukaBayar(${i})">Bayar</button>`}</td></tr>`).join('');
 const r=s.filter(x=>x.lunas);
 $('#riwayat').hidden=!r.length;
 $('#baris').innerHTML=r.map(x=>`<tr><td>${x.tgl}</td><td>${x.bulan}</td><td>${TA}</td><td>${rp(NOMINAL_SPP)}</td><td>${x.metode}</td><td><span class="badge lunas">Berhasil</span></td></tr>`).join('');
}
function bukaBayar(i){dipilih=i;$('#dlgInfo').textContent=sppData()[i].bulan+' · '+rp(NOMINAL_SPP);$('#dlg').showModal()}
function konfirmasiBayar(){
 const m=document.querySelector('input[name=metode]:checked').value,s=sppData();
 Object.assign(s[dipilih],{lunas:true,tgl:tgl(),metode:m});simpanSpp(s);
 $('#dlg').close();gambarSpp();toast('Pembayaran SPP berhasil');
}

/* ====== PROFIL ====== */
function halamanProfil(){
 const u=user();
 $('#avatar').innerHTML=`<img src="${u.foto||FOTO_PROFIL}" alt="Foto ${u.nama}" onerror="this.replaceWith('${u.nama[0].toUpperCase()}')">`;
 $('#foto').onchange=gantiFoto;
 $('#info').innerHTML=[['Nama',u.nama],['Kelas',u.kelas],['NIS',u.nis],['Jurusan',u.jurusan]].map(([k,v])=>`<div><span>${k}</span><b>${v}</b></div>`).join('');
 for(const k of ['nama','nis','kelas','jurusan'])$('#'+k).value=u[k];
 const tutup=()=>{$('#boxEdit').hidden=true;$('#btnEdit').hidden=false;for(const k of ['nama','nis','kelas','jurusan'])$('#'+k).value=user()[k]};
 $('#btnEdit').onclick=()=>{$('#boxEdit').hidden=false;$('#btnEdit').hidden=true;$('#nama').focus()};
 $('#batal').onclick=tutup;
 $('#formProfil').onsubmit=e=>{e.preventDefault();
  const d={};for(const k of ['nama','nis','kelas','jurusan']){d[k]=$('#'+k).value.trim();if(!d[k]){toast('Semua kolom harus diisi');return}}
  if(d.nis!==user().nis&&akun()[d.nis]){toast('NIS sudah dipakai siswa lain');return}
  simpanUser(d);toast('Profil berhasil diperbarui');halamanProfil();tutup()};
}

function gantiFoto(e){
 const f=e.target.files[0];if(!f)return;
 const r=new FileReader();
 r.onload=()=>{const im=new Image();
  im.onload=()=>{const s=300,c=document.createElement('canvas');c.width=c.height=s;
   const m=Math.min(im.width,im.height);
   c.getContext('2d').drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,s,s);
   simpanUser({foto:c.toDataURL('image/jpeg',.8)});
   toast('Foto profil diperbarui');halamanProfil()};
  im.onerror=()=>toast('File harus berupa gambar');
  im.src=r.result};
 r.readAsDataURL(f);
}
