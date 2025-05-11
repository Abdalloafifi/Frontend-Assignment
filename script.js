document.addEventListener('DOMContentLoaded', () => {
  const svg = document.getElementById('map');
  let units;

  fetch('/src/assets/polygons.json')
    .then(res => res.json())
    .then(data => {
      data.forEach((item, idx) => {
        const g = document.createElementNS(svg.namespaceURI, 'g');
        g.setAttribute('class', 'unit');
        g.setAttribute('id', item.id);
        g.dataset.status = item.status;
        g.dataset.area = item.area;
        g.dataset.price = item.price;

        const rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('x', '100');
        rect.setAttribute('y', String(50 + idx * 80)); 
        rect.setAttribute('width', '350');
        rect.setAttribute('height', '80');
        g.appendChild(rect);

        const text = document.createElementNS(svg.namespaceURI, 'text');
        text.setAttribute('x', '275');
        text.setAttribute('y', String(95 + idx * 80));
        text.textContent = item.status;
        g.appendChild(text);

        svg.appendChild(g);
      });

      units = document.querySelectorAll('.unit');
      initializeFilters();
    })
    .catch(err => console.error('Failed to load polygon data:', err));

  function initializeFilters() {
    const statusFilters = document.querySelectorAll('.status-filter');
    const areaFilter = document.getElementById('area-filter');
    const priceFilter = document.getElementById('price-filter');
    const areaValue = document.getElementById('area-value');
    const priceValue = document.getElementById('price-value');

    function updateValues() {
      const currentArea = parseInt(areaFilter.value);
      const maxArea = parseInt(areaFilter.max);
      const currentPrice = parseInt(priceFilter.value);
      const maxPrice = parseInt(priceFilter.max);

      areaValue.textContent = `${currentArea} - ${maxArea} Sq.m`;
      priceValue.textContent = `${currentPrice.toLocaleString()} - ${parseInt(maxPrice).toLocaleString()} LE`;
    }

    function getSelectedStatuses() {
      return Array.from(statusFilters)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    }

    function filterUnits() {
      const selected = getSelectedStatuses();
      const maxA = parseInt(areaFilter.value);
      const maxP = parseInt(priceFilter.value);

      units.forEach(u => {
        const a = parseInt(u.dataset.area);
        const p = parseInt(u.dataset.price);
        const ok = selected.includes(u.dataset.status) && a <= maxA && p <= maxP;
        u.style.display = ok ? '' : 'none';
      });
    }

    statusFilters.forEach(cb => cb.addEventListener('change', filterUnits));
    areaFilter.addEventListener('input', () => { updateValues(); filterUnits(); });
    priceFilter.addEventListener('input', () => { updateValues(); filterUnits(); });

    document.getElementById('close-info').addEventListener('click', () => {
      document.getElementById('product-info').classList.add('hidden');
    });
        function showTooltip(e) {
    const unit = e.target.closest('.unit');
    if (!unit) return;
    const status = unit.dataset.status;
    const area = unit.dataset.area;
    const price = parseInt(unit.dataset.price).toLocaleString();
    tooltip.innerHTML = `Status: ${status}<br>Area: ${area} Sq.m<br>Price: LE ${price}`;
    tooltip.style.display = 'block';
    tooltip.style.left = `${e.pageX + 10}px`;
    tooltip.style.top = `${e.pageY + 10}px`;
  }

  function hideTooltip() {
    tooltip.style.display = 'none';
  }

    document.querySelectorAll('.unit').forEach(unit => {
      unit.addEventListener('click', (e) => {
        const infoBox = document.getElementById('product-info');
        const status = unit.dataset.status;
        const area = unit.dataset.area;
        const price = parseInt(unit.dataset.price).toLocaleString();

        document.getElementById('unit-status').innerText = `unit Type: ${status}`;
        document.getElementById('unit-area').innerText = `Total Area: ${area} m²`;
        document.getElementById('unit-price').innerText = `Price: ${price} EGP`;

        infoBox.classList.remove('hidden');
      });
    });
        units.forEach(unit => {
    unit.addEventListener('mousemove', showTooltip);
    unit.addEventListener('mouseleave', hideTooltip);
  });

    updateValues();
    filterUnits();
  }
});
