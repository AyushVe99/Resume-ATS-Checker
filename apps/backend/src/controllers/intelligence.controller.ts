import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { GeminiService } from '../services/gemini.service';

const geminiService = new GeminiService();

export class IntelligenceController {
  public generateIdentity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { resumeId } = req.body;
      if (!resumeId) {
        res.status(400).json({ success: false, message: 'resumeId is required' });
        return;
      }

      const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
      if (!resume) {
        res.status(404).json({ success: false, message: 'Resume not found' });
        return;
      }

      const existingIdentity = await prisma.engineeringIdentity.findUnique({
        where: { resumeId },
        include: { evidence: true }
      });

      if (existingIdentity) {
        res.status(200).json({ success: true, data: existingIdentity });
        return;
      }

      const identityData = await geminiService.inferEngineeringIdentity(resume.content);

      const identity = await prisma.engineeringIdentity.create({
        data: {
          resumeId,
          archetype: identityData.archetype,
          level: identityData.level,
          coreDomains: identityData.coreDomains,
          projects: identityData.projects || [],
          timeline: identityData.timeline || [],
          evidence: {
            create: (identityData.evidenceNodes || []).map((node: any) => {
              const offsetStart = resume.content.indexOf(node.snippet);
              return {
                domain: node.domain,
                skill: node.skill,
                snippet: node.snippet,
                offsetStart: offsetStart !== -1 ? offsetStart : null,
                offsetEnd: offsetStart !== -1 ? offsetStart + node.snippet.length : null,
              };
            })
          }
        },
        include: { evidence: true }
      });

      res.status(200).json({ success: true, data: identity });
    } catch (error: unknown) {
      console.error('Generate Identity Error:', error);
      res.status(500).json({ success: false, message: 'Failed to generate identity' });
    }
  };

  public generateReadiness = async (req: Request, res: Response): Promise<void> => {
    try {
      const { resumeId, targetRoleTitle } = req.body;
      if (!resumeId || !targetRoleTitle) {
         res.status(400).json({ success: false, message: 'resumeId and targetRoleTitle required' });
         return;
      }
      
      const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
      if (!resume) {
        res.status(404).json({ success: false, message: 'Resume not found' });
        return;
      }

      const targetRole = await prisma.targetRole.create({
        data: {
          userId: resume.userId,
          title: targetRoleTitle
        }
      });

      const readinessData = await geminiService.inferSkillGaps(resume.content, targetRoleTitle);

      const readiness = await prisma.readinessAnalysis.create({
        data: {
          resumeId,
          targetRoleId: targetRole.id,
          riskMap: readinessData.riskMap || [],
          treeNodes: readinessData.treeNodes || [],
          treeEdges: readinessData.treeEdges || [],
        }
      });

      res.status(200).json({ success: true, data: { targetRole, readiness } });
    } catch (error) {
      console.error('Generate Readiness Error:', error);
      res.status(500).json({ success: false, message: 'Failed to generate readiness' });
    }
  }

  public getEvidence = async (req: Request, res: Response): Promise<void> => {
    try {
      const nodeId = req.params.nodeId as string;
      const evidence = await prisma.evidenceNode.findUnique({ where: { id: nodeId } });
      
      if (!evidence) {
        res.status(404).json({ success: false, message: 'Evidence not found' });
        return;
      }

      res.status(200).json({ success: true, data: evidence });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to get evidence' });
    }
  }
}
