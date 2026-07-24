$(document).ready(function() {
    $('.nav-link-page').on('click', function(e) {
        e.preventDefault();
        
        var targetPage = $(this).data('page');
        var $currentPage = $('.page-view.active');
        var $targetPage = $('#page-' + targetPage);

        if ($targetPage.hasClass('active')) return;

        $('.nav-link-page').removeClass('active');
        $(`.nav-link-page[data-page="${targetPage}"]`).addClass('active');

        $currentPage.addClass('fade-out');

        setTimeout(function() {
            $currentPage.removeClass('active fade-out');
            $targetPage.addClass('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);

        $('#menuNavbar').collapse('hide');
    });
});

$(document).ready(function () {

    var keranjang = [];
    var metodeTerpilih = null;
    var editIndexAktif = -1;
    var modeAktif = 'keranjang'; 
    var NOMOR_WA = '628216457581';

    function tampilkanToast(pesan) {
        $('#toastNotifText').text(pesan);
        $('#toastNotifSky').addClass('tampil');
        setTimeout(function () {
            $('#toastNotifSky').removeClass('tampil');
        }, 2200);
    }

    function resetFormPesanan() {
        $('#inputNamaPelanggan').val('');
        $('#inputCatatan').val('');
        $('#jumlahPesanan').text('1');
        $('.nota-metode-chip').removeClass('active');
        metodeTerpilih = null;
        editIndexAktif = -1;
        $('#editIndex').val(-1);
        $('#btnSimpanKeranjang').html('<i class="bi bi-basket3-fill"></i> Tambah Keranjang');
    }

    function renderBadge() {
        var total = keranjang.length;
        if (total > 0) {
            $('#badgeKeranjang').text(total).show();
        } else {
            $('#badgeKeranjang').hide();
        }
    }

    function renderKeranjang() {
        var $list = $('#listKeranjang');
        $list.empty();

        if (keranjang.length === 0) {
            $list.append('<p class="keranjang-kosong-text">Keranjang masih kosong. Yuk pilih oleh-oleh favoritmu!</p>');
            renderBadge();
            return;
        }

        keranjang.forEach(function (item, idx) {
            var catatanHtml = item.catatan
                ? '<p class="catatan-text">"' + item.catatan + '"</p>'
                : '';
            var hargaHtml = item.harga ? ' &middot; ' + item.harga : '';

            var itemHtml =
                '<div class="item-keranjang-sky" data-idx="' + idx + '">' +
                    '<h6>' + item.produk + '</h6>' +
                    '<p class="meta">' + item.nama + ' &middot; ' + item.jumlah + 'x' + hargaHtml + '</p>' +
                    '<p class="meta"><i class="bi bi-credit-card-2-front"></i> ' + item.metode + '</p>' +
                    catatanHtml +
                    '<div class="item-keranjang-actions">' +
                        '<button type="button" class="btn-edit-item" data-idx="' + idx + '"><i class="bi bi-pencil-fill"></i> Edit</button>' +
                        '<button type="button" class="btn-hapus-item" data-idx="' + idx + '"><i class="bi bi-trash-fill"></i> Hapus</button>' +
                    '</div>' +
                '</div>';
            $list.append(itemHtml);
        });

        renderBadge();
    }

    $(document).on('click', '.btn-pesan-sky[data-toggle="modal"], .btn-keranjang-sky', function () {
        resetFormPesanan();
        var $btn = $(this);
        modeAktif = $btn.data('mode') === 'pesan' ? 'pesan' : 'keranjang';

        $('#notaProdukNama').text($btn.data('produk'));
        $('#notaProdukImg').attr('src', $btn.data('img')).attr('alt', $btn.data('produk'));
        var harga = $btn.data('harga');
        $('#notaProdukHarga').text(harga ? harga : 'Hubungi kami untuk harga');

        if (modeAktif === 'pesan') {
            $('#notaEyebrowText').text('Isi Data Pesanan');
            $('#btnSimpanKeranjang').html('<i class="bi bi-whatsapp"></i> Kirim Pesanan ke WhatsApp');
        } else {
            $('#notaEyebrowText').text('Manari Pekanbaru — Nota Pesanan');
            $('#btnSimpanKeranjang').html('<i class="bi bi-basket3-fill"></i> Tambah Keranjang');
        }
    });

    $('#btnTambah').on('click', function () {
        var jml = parseInt($('#jumlahPesanan').text(), 10);
        $('#jumlahPesanan').text(jml + 1);
    });
    $('#btnKurang').on('click', function () {
        var jml = parseInt($('#jumlahPesanan').text(), 10);
        if (jml > 1) $('#jumlahPesanan').text(jml - 1);
    });

    $('.nota-metode-chip').on('click', function () {
        $('.nota-metode-chip').removeClass('active');
        $(this).addClass('active');
        metodeTerpilih = $(this).data('metode');
    });

    $('#btnSimpanKeranjang').on('click', function () {
        var nama = $('#inputNamaPelanggan').val().trim();
        var jumlah = parseInt($('#jumlahPesanan').text(), 10);
        var catatan = $('#inputCatatan').val().trim();

        if (!nama) {
            tampilkanToast('Nama pelanggan wajib diisi ya!');
            $('#inputNamaPelanggan').focus();
            return;
        }
        if (!metodeTerpilih) {
            tampilkanToast('Pilih metode pembayaran dulu ya!');
            return;
        }

        var namaProduk = $('#notaProdukNama').text();
        var hargaProduk = $('#notaProdukHarga').text() === 'Hubungi kami untuk harga' ? '' : $('#notaProdukHarga').text();

        if (modeAktif === 'pesan') {
            var pesanWA =
                'Halo Manari Pekanbaru, saya ingin pesan:\n' +
                '- Produk: ' + namaProduk + (hargaProduk ? ' (' + hargaProduk + ')' : '') + '\n' +
                '- Nama Pelanggan: ' + nama + '\n' +
                '- Jumlah Pesanan: ' + jumlah + '\n' +
                '- Metode Pembayaran: ' + metodeTerpilih +
                (catatan ? '\n- Catatan: ' + catatan : '');

            var linkWA = 'https://wa.me/' + NOMOR_WA + '?text=' + encodeURIComponent(pesanWA);
            window.open(linkWA, '_blank');

            tampilkanToast('Pesanan disiapkan, lanjutkan di WhatsApp!');
            $('#modalPesanan').modal('hide');
            return;
        }

        var dataItem = {
            produk: namaProduk,
            harga: hargaProduk,
            nama: nama,
            jumlah: jumlah,
            metode: metodeTerpilih,
            catatan: catatan
        };

        if (editIndexAktif > -1) {
            keranjang[editIndexAktif] = dataItem;
            tampilkanToast('Pesanan berhasil diperbarui!');
        } else {
            keranjang.push(dataItem);
            tampilkanToast('Berhasil ditambahkan ke keranjang!');
        }

        renderKeranjang();
        $('#modalPesanan').modal('hide');
    });

    $(document).on('click', '.btn-edit-item', function () {
        var idx = $(this).data('idx');
        var item = keranjang[idx];
        editIndexAktif = idx;
        $('#editIndex').val(idx);
        modeAktif = 'keranjang';
        $('#notaEyebrowText').text('Manari Pekanbaru — Nota Pesanan');

        $('#notaProdukNama').text(item.produk);
        $('#notaProdukHarga').text(item.harga ? item.harga : 'Hubungi kami untuk harga');
        $('#inputNamaPelanggan').val(item.nama);
        $('#jumlahPesanan').text(item.jumlah);
        $('#inputCatatan').val(item.catatan);

        $('.nota-metode-chip').removeClass('active');
        $('.nota-metode-chip[data-metode="' + item.metode + '"]').addClass('active');
        metodeTerpilih = item.metode;

        $('#btnSimpanKeranjang').html('<i class="bi bi-save-fill"></i> Simpan Perubahan');

        $('#panelKeranjang').removeClass('buka');
        $('#overlayKeranjang').removeClass('tampil');
        $('#modalPesanan').modal('show');
    });

    $(document).on('click', '.btn-hapus-item', function () {
        var idx = $(this).data('idx');
        keranjang.splice(idx, 1);
        renderKeranjang();
        tampilkanToast('Item dihapus dari keranjang.');
    });

    $('#btnBukaKeranjang').on('click', function () {
        renderKeranjang();
        $('#panelKeranjang').addClass('buka');
        $('#overlayKeranjang').addClass('tampil');
    });
    function tutupPanelKeranjang() {
        $('#panelKeranjang').removeClass('buka');
        $('#overlayKeranjang').removeClass('tampil');
    }
    $('#btnTutupKeranjang').on('click', tutupPanelKeranjang);
    $('#overlayKeranjang').on('click', tutupPanelKeranjang);

    $('#btnCheckout').on('click', function () {
        if (keranjang.length === 0) {
            tampilkanToast('Keranjang masih kosong!');
            return;
        }
        tampilkanToast('Checkout berhasil! Terima kasih sudah belanja di Manari.');
        keranjang = [];
        renderKeranjang();
        tutupPanelKeranjang();
    });

    $('#modalPesanan').on('show.bs.modal', function () {
        $('#panelKeranjang').removeClass('buka');
        $('#overlayKeranjang').removeClass('tampil');
        $('.modal-backdrop').remove();
    });

    $('#modalPesanan').on('hidden.bs.modal', function () {
        setTimeout(function () {
            if ($('.modal.show').length === 0) {
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open').css('padding-right', '');
            }
        }, 50);
    });

    function perbaruiTampilanFab() {
        if ($('#page-produk').hasClass('active')) {
            $('#btnBukaKeranjang').addClass('tampil-fab');
        } else {
            $('#btnBukaKeranjang').removeClass('tampil-fab');
            tutupPanelKeranjang();
        }
    }
    perbaruiTampilanFab();
    $('.nav-link-page').on('click', function () {
        setTimeout(perbaruiTampilanFab, 250);
    });

});
