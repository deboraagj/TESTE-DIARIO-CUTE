// script.js - navegação do mês simples (prev/next)
(function(){
  // pega ano/mes atuais da URL se houver
  const params = new URLSearchParams(window.location.search);
  let year = params.get('year') ? Number(params.get('year')) : (new Date()).getFullYear();
  let month = params.get('month') ? Number(params.get('month')) : (new Date()).getMonth(); // 0-based

  // detecta botões prev/next no form (fornecidos no template)
  document.querySelectorAll('button[name="change"]').forEach(btn=>{
    btn.addEventListener('click', function(e){
      e.preventDefault();
      const v = this.value;
      if(v === 'prev'){ month--; if(month < 0){ month = 11; year--; } }
      if(v === 'next'){ month++; if(month > 11){ month = 0; year++; } }
      // redireciona para a mesma rota com query
      window.location.href = `/?year=${year}&month=${month}`;
    });
  });
})();
