# ID: tulisan bahasa Indonesia

Levels: `block` is never acceptable in shipped work, `justify` passes only with a one-line reason next to it (`antislopdev-allow <ID>: reason`), `warn` is a smell and three in one file count as `justify`. Check `static` and `heuristic` rules are found by `npx antislopdev check`; `review` rules need a look at the rendered result.

These rules name defaults to avoid, not a style to adopt. Anything here is fine when someone chose it on purpose.

| ID | Rule | Level | Check |
|---|---|---|---|
| ID-01 | **Pembuka basa-basi.** "Di era digital saat ini", "Di zaman yang serba cepat", "Seiring perkembangan teknologi", "Pernahkah kamu bertanya-tanya", "Mari kita selami", "Pada artikel kali ini kita akan membahas". | block | static |
| ID-02 | **"Tidak hanya X, tetapi juga Y" berulang.** Konstruksi kontras yang dipakai biar terdengar dalam. | warn | static |
| ID-03 | **Kosakata promosi kosong.** solusi terbaik, revolusioner, inovatif, terdepan, memberdayakan, mengoptimalkan secara maksimal, tingkatkan pengalaman, transformasi digital, ekosistem (tanpa makna). | warn | static |
| ID-04 | **Penutup klise.** "Semoga bermanfaat", "Kesimpulannya", "Dengan demikian", "Demikianlah artikel ini", "Jangan lupa share". | block | static |
| ID-05 | **Terjemahan mentah.** Struktur kalimat bahasa Inggris yang diterjemahkan kata per kata: "Ini adalah penting untuk", "di mana" sebagai penghubung umum, "Anda dapat" berulang di setiap kalimat. | warn | heuristic |
| ID-06 | **Sapaan pemasaran.** "Halo, Sobat!", "Yuk, simak!", "Kuy", dipakai di dokumentasi atau UI produk. | warn | static |
| ID-07 | **Campuran register.** Formal dan santai berganti di paragraf yang sama ("Anda" lalu "kamu", "tidak" lalu "gak") tanpa alasan. | warn | heuristic |
| ID-08 | **CTA umum.** "Mulai Sekarang", "Selengkapnya", "Klik di sini", "Pelajari Lebih Lanjut" di tempat yang bisa menjelaskan aksinya. | warn | static |
| ID-09 | **Tanda seru berlebihan.** Lebih dari satu tanda seru per layar atau per 300 kata. | warn | static |
| ID-10 | **Klausa makna di ujung kalimat.** ", yang menunjukkan pentingnya", ", menegaskan komitmen", ", mencerminkan perubahan besar" sebagai tempelan. | warn | static |
| ID-11 | **Pengagungan berlebihan.** "menjadi bukti nyata", "memainkan peran penting", "tonggak sejarah", "warisan abadi" untuk hal biasa. | warn | static |
| ID-12 | **Otoritas tanpa nama.** "Para ahli mengatakan", "Banyak yang percaya", "Studi menunjukkan" tanpa sumber yang disebut. | block | static |
| ID-13 | **Sisa obrolan chatbot.** "Tentu! Berikut", "Pertanyaan bagus", "Sebagai model bahasa AI", "Semoga membantu" yang ikut terbit. | block | static |
| ID-14 | **Rentang palsu.** "Mulai dari UMKM hingga korporasi", "dari hulu ke hilir" padahal ujungnya gak satu skala. | warn | static |
