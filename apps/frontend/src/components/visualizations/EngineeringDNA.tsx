'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function EngineeringDNA({ data }: { data: any }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Transform AI identity data into d3 nodes/links
    const nodes: any[] = [];
    const links: any[] = [];
    
    // Core Archetype Node
    nodes.push({ id: data.archetype, group: 0, radius: 40, color: 'var(--accent-primary)' });

    // Domain Nodes
    data.coreDomains?.forEach((domain: string) => {
      nodes.push({ id: domain, group: 1, radius: 30, color: '#3b82f6' });
      links.push({ source: data.archetype, target: domain, value: 3 });
    });

    // Skill Nodes (from evidence)
    const processedSkills = new Set<string>();
    data.evidence?.forEach((ev: any) => {
      if (!processedSkills.has(ev.skill)) {
        nodes.push({ id: ev.skill, group: 2, radius: 20, color: 'var(--accent-secondary)' });
        links.push({ source: ev.domain || data.coreDomains[0], target: ev.skill, value: 2 });
        processedSkills.add(ev.skill);
      }
    });

    // Filter invalid links where source or target doesn't exist
    const nodeIds = new Set(nodes.map(n => n.id));
    const validLinks = links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

    const width = 600;
    const height = 600;
    const graphData = { nodes, links: validLinks };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height].join(' '))
      .attr('style', 'max-width: 100%; height: auto;');
      
    // Clear previous renders (for strict mode)
    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    const link = svg.append('g')
      .attr('stroke', '#4b5563')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('stroke-width', (d: any) => Math.sqrt(d.value));

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(graphData.nodes)
      .join('circle')
      .attr('r', (d: any) => d.radius)
      .attr('fill', (d: any) => d.color);

    const label = svg.append('g')
      .selectAll('text')
      .data(graphData.nodes)
      .join('text')
      .text((d: any) => d.id)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => d.radius + 15);

    // Add drag behavior
    const drag = d3.drag<SVGCircleElement, any>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag as any);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className="flex justify-center items-center p-8 bg-gray-900/50 border border-gray-800 rounded-3xl w-full">
      <svg ref={svgRef} className="overflow-visible" />
    </div>
  );
}
