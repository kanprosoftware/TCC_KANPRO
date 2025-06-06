import prisma from "../models/prismaClient.js";

const getTecnologias = async (projectId) => {
    //console.log("getTecnologias.projectId: ", projectId);
    const tecproject = await prisma.projetoTecnologia.findMany ({
        where: {
            projeto_id: parseInt(projectId),
        },
        include: {
            projeto: {
                include: {
                    tecnologias: {
                        include: {
                            tecnologia: true,
                        },
                    },
                },
            },
        },
    });
    //console.log("tecproject: ", tecproject[0].projeto.tecnologias);
    return tecproject[0].projeto.tecnologias;
}

export const getProjectsByDevId = async (devId) => {
    //console.log("CHAMOU O SERVICE - devId");
    const projects = await prisma.projetoUsuario.findMany({
        where: { usuario_id: parseInt(devId), owner: true },
        include: {
            projeto: {
                include: {
                    tecnologias: {
                        include: {
                            tecnologia: true,
                        }
                    },
                    projetoUsuarios: {
                        include: {
                            usuario: true,
                        }
                    },
                },
            },
        },
    });
    //console.log("projects: ", projects);
    return projects;
}

export const getProjectsTeamByDevId = async (devId) => {
    //console.log("CHAMOU O SERVICE - devId");
    //console.log("CHAMOU O SERVICE - devId");
    const projects = await prisma.projetoUsuario.findMany({
        where: { usuario_id: parseInt(devId), owner: false },
        include: {
            projeto: {
                include: {
                    tecnologias: {
                        include: {
                            tecnologia: true,
                        }
                    },
                    projetoUsuarios: {
                        include: {
                            usuario: true,
                        }
                    },
                },
            },
        },
    });

    //console.log("projects: ", projects);

    return projects;
}

export const getProjects = async () => {
    //console.log("Chamou sevice.getProjects");
    const projects = await prisma.projeto.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            tecnologias: true,
            desenvolvedor: true,
        },
    });

    return project;
}
export const getProjectById = async (projectId) => {
    const project = await prisma.projeto.findUnique({
        where: { projeto_id: parseInt(projectId)},
        include: {
            tecnologias: {
                include: {
                    tecnologia: true,
                }
            }
        }
    });

    return project;
}
export const createProject = async (projectData) => {
    //console.log("projectData: ", projectData);
    const project = await prisma.projeto.create({
        data: {
            nome: projectData.nome,
            descricao: projectData.descricao,
        },
    });

    const projectUser = await prisma.projetoUsuario.create({
        data: {
            usuario_id: projectData.participanteProject,
            projeto_id: project.projeto_id,
            owner: true,
        },
    });

    const tecnologiasPromises = projectData.tecnologias.map(async (tecnologia) => {
        //console.log("tecnologia: ", tecnologia);
        const tecnologiaDb = await prisma.tecnologia.findMany({
            where: { descricao: tecnologia },
        });
        //console.log("tecnologiaDb", tecnologiaDb[0].tecnologia_id);
        return prisma.projetoTecnologia.create({
            data: {
                projeto_id: project.projeto_id,
                tecnologia_id: tecnologiaDb[0].tecnologia_id,
            },
        });
    });

    return project;
}

export const addParticipantes = async (addData) => {
    // console.log("addData: ", addData);
    const projetoUsuario = await prisma.projetoUsuario.createMany({
        data: addData.participantesIds.map(id => ({
            usuario_id: id,
            projeto_id: addData.projeto_id
        }))
    });
}

export const getParticipantes = async (projectId) => {
    const projetoUsuario = await prisma.projetoUsuario.findMany({
        where: { projeto_id: parseInt(projectId) },
        include: {
            usuario: true,
        },
    });
    return projetoUsuario;
}

export const removeParticipante = async (data) => {
    // console.log("data: ", data);
    const projetoUsuario = await prisma.projetoUsuario.delete({
        where: { 
            projeto_id: parseInt(data.projeto_id),
            usuario_id: parseInt(data.usuario_id),
            projetoUsuario_id: parseInt(data.projetoUsuario_id),
        },
    });
    return projetoUsuario;
}

export const deleteProjectById = async (deleteData) => {
    const projetoParticipante = await prisma.projetoUsuario.findMany({
        where: { projeto_id: parseInt(deleteData.projeto_id), usuario_id: parseInt(deleteData.usuario_id) },
        select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
    });
    if (projetoParticipante.length === 0) {
        throw new Error("Voce não participa deste projeto.");
    }
    else {
        const deletedProject = await prisma.projeto.delete({
            where: {
                projeto_id: parseInt(deleteData.projeto_id),
            },
        });
        return deletedProject;
    }
    
}

export const detailsProjectById = async (projectData) => {
    const projetoParticipante = await prisma.projetoUsuario.findMany({
        where: { projeto_id: parseInt(projectData.projeto_id), usuario_id: parseInt(projectData.usuario_id) },
        select: { projetoUsuario_id: true, projeto_id: true, usuario_id: true },
    });
    if (projetoParticipante.length === 0) {
        throw new Error("Voce não participa deste projeto.");
    }
    else {
        const detailsProject = await prisma.projeto.findMany({
            where: { projeto_id: parseInt(projectData.projeto_id) },
            include: {
                tecnologias: true,
            },
        });
        return detailsProject;
    }
}

export const devSugestion = async (projectId, owner_id) => {
    //console.log("chamou o sercice");
    //console.log("projectId: ", projectId);
    const tecsProject = await getTecnologias(parseInt(projectId));
    //console.log("tecsProject: ", tecsProject);
    const tecs = tecsProject.map(tp => tp.tecnologia_id);
    //console.log("tecs: ", tecs);
    const sujestionDev = await prisma.habilidadeUsuario.findMany({
        where: {
            tecnologia_id: {
                in: Array.isArray(tecs) ? tecs : [tecs]
            },
            usuario_id: {
                not: { equals: owner_id }
            }
        },
        distinct: ['usuario_id'],
        include: {
            usuario: true
        },
        orderBy: {
            usuario: {
            nome: 'asc' // ou 'desc'
            }
        }
    });
    //console.log("sugetionDev: ", sujestionDev);
    const devs = sujestionDev.map(d => ({
        usuario_id: d.usuario.usuario_id,
        nome: d.usuario.nome
    }));
    //console.log("devs: ", devs);
    const remmantDevs = await prisma.usuario.findMany({
        where: {
            usuario_id: {
                notIn: devs.map(dev => dev.usuario_id),
                not: { equals: owner_id }
            },
        },
    });
    //console.log("remmantDevs: ", remmantDevs);
    return {
        sugestaoDevs: devs,
        desenvolvedoresRestantes: remmantDevs
    };
}

export const updateName = async (data) => {
    const projetoUsuario = await prisma.projeto.update({
        where: { 
            projeto_id: parseInt(data.projeto_id),
        },
        data: {
            nome: data.nome
        }
    });
    return projetoUsuario;
}

export const updateDescription = async (data) => {
    const projetoUsuario = await prisma.projeto.update({
        where: { 
            projeto_id: parseInt(data.projeto_id),
        },
        data: {
            descricao: data.descricao
        }
    });
    return projetoUsuario;
}

export const updateTecnologis = async (data) => {
    // console.log("data: ", data);
    await prisma.projetoTecnologia.deleteMany({
    where: {
        projeto_id: parseInt(data.projeto_id),
    },
    });

    // Em seguida, cria as novas associações
    return await prisma.projetoTecnologia.createMany({
        data: data.tecnologias.map(tecnologia_id => ({
            projeto_id: parseInt(data.projeto_id),
            tecnologia_id
        }))
    });
}

export const addAttachment = async (data) => {
    // console.log("data: ", data);
    const arquivosCriados = await Promise.all(
      data.arquivos.map(arqs =>
        prisma.anexoProjeto.create({
          data: {
            projeto_id: parseInt(data.projeto_id),
            nome: arqs.nome,
            conteudo: arqs.conteudo,
            tipo: arqs.tipo,
          }
        })
      )
    );
    
    return arquivosCriados;
}

export const listAttachment = async (tarefa_id) => {
  return await prisma.anexoProjeto.findMany({
    where: { projeto_id: parseInt(tarefa_id) },
    orderBy: { created_at: "desc" },
  });
}

export const downloadAttachmentById = async (data) => {
    const file = await prisma.anexoProjeto.findUnique({
      where: { anexo_id: parseInt(data.anexo_id) }
    });
    return file;
}

export const excludeAttachment = async (data) => {
    return await prisma.anexoProjeto.delete({
      where: {
        anexo_id: parseInt(data.anexo_id),
        projeto_id: parseInt(data.projeto_id),
      }
    });
}