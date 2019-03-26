exports.run = (client, message, args) => {
    
    createEmbed({
        title: 'Test simulator',
        description: 'Jeu de gestion',
        engine: 'Unreal Engine 4.22',
        projectStatus: 'En cours de développement',
        descriptionEquipe: '1 chien et 3 chats',
        posteLibre: 'Besoin d\'un véto',
        remuneration: '1 os et du sucre',
        contact: 'contact@exemple.com',
        other: 'Yay'
    });

    function createEmbed (parametres = {
        title,
        description,
        engine,
        projectStatus,
        descriptionEquipe,
        posteLibre,
        remuneration,
        contact,
        other
    }) {
        message.channel.send({embed: {
            color: 3447003,
            author: {
              name: message.member.user.tag,
              icon_url: message.member.user.avatarURL
            },
            title: parametres.title,
            description: parametres.description,
            fields: [{
                name: "Moteur de jeu",
                value: parametres.engine
              },
              {
                name: "Status du projet",
                value: parametres.projectStatus
              },
              {
                name: "Description de l'équipe",
                value: parametres.descriptionEquipe
              },
              {
                name: "Poste(s) à pourvoir",
                value: parametres.posteLibre
              },
              {
                name: "Rémunération",
                value: parametres.remuneration
              },
              {
                name: "Contact",
                value: parametres.contact
              },
              {
                name: "Autres",
                value: parametres.other
              },
            ],
            timestamp: new Date(),
            footer: {
              text: "unreal-fr.dev"
            }
          }
        });
    }
}