import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";


async function createAdmin() {

  const email = process.env.SEED_ADMIN_EMAIL || "admin@crm.com";
  const motDePasse = process.env.SEED_ADMIN_PASSWORD || "admin123";


  const existe = await prisma.user.findUnique({
    where: { email },
  });


  if (existe) {
    console.log("Admin existe déjà");
    return;
  }


  const password = await bcrypt.hash(motDePasse, 10);


  await prisma.user.create({
    data:{
      nom:"Administrateur",
      email,
      password,
      role:"ADMIN",
      actif:true
    }
  });


  console.log("ADMIN créé :", email);

}




async function createCategories(){

  console.log("Création catégories...");

  const categories=[];


  for(let i=0;i<20;i++){

    const categorie =
    await prisma.categorie.create({

      data:{
        nom: `Catégorie-${i+1}-${faker.commerce.department()}`,
        description: faker.commerce.productDescription()
      }

    });


    categories.push(categorie);

  }


  return categories;

}





async function createFournisseurs(){

  console.log("Création fournisseurs...");

  const fournisseurs=[];


  for(let i=0;i<50;i++){

    const fournisseur =
    await prisma.fournisseur.create({

      data:{
        nom: faker.company.name(),
        telephone: faker.phone.number(),
        email: faker.internet.email(),
        adresse: faker.location.city()
      }

    });


    fournisseurs.push(fournisseur);

  }


  return fournisseurs;

}







async function createProduits(categories:any[], fournisseurs:any[]){

console.log("Création produits...");


const produits=[];


for(let i=0;i<300;i++){


const produit =
await prisma.produit.create({

data:{


reference:`REF-${10000+i}`,


codeBarre:faker.string.numeric(13),


nom:faker.commerce.productName(),


categorieId:
faker.helpers.arrayElement(categories).id,


fournisseurId:
faker.helpers.arrayElement(fournisseurs).id,


marque:
faker.company.name(),


prixAchat:
faker.number.float({
min:1000,
max:500000
}),


prixVente:
faker.number.float({
min:5000,
max:1000000
}),


quantite:
faker.number.int({
min:0,
max:500
}),


seuilAlerte:10

}

});


produits.push(produit);


}


return produits;

}








async function createClients(){

console.log("Création clients...");


const clients=[];


for(let i=0;i<500;i++){


const client =
await prisma.client.create({

data:{


nom:
faker.person.fullName(),


entreprise:
faker.company.name(),


email:
faker.internet.email(),


telephone:
faker.phone.number(),


whatsapp:
faker.phone.number(),


ville:
faker.location.city(),


pays:"Madagascar",


secteur:
faker.commerce.department(),


statut:
faker.helpers.arrayElement([
"Client",
"Prospect",
"VIP"
]),


score:
faker.number.int({
min:0,
max:100
})


}

});


clients.push(client);


}


return clients;

}









async function createOpportunites(clients:any[]){

console.log("Création opportunités...");


const opportunites=[];


for(let i=0;i<300;i++){


const opportunite =
await prisma.opportunite.create({

data:{


nom:
faker.commerce.productName(),


clientId:
faker.helpers.arrayElement(clients).id,


montant:
faker.number.float({
min:50000,
max:20000000
}),


probabilite:
faker.number.int({
min:10,
max:100
}),


statut:
faker.helpers.arrayElement([
"Prospection",
"Négociation",
"Gagnée",
"Perdue"
])


}

});


opportunites.push(opportunite);


}


return opportunites;

}









async function createFactures(
clients:any[],
opportunites:any[],
produits:any[]
){


console.log("Création factures...");


for(let i=0;i<500;i++){


const facture =
await prisma.facture.create({

data:{


numero:`FAC-${100000+i}`,


clientId:
faker.helpers.arrayElement(clients).id,


opportuniteId:
faker.helpers.arrayElement(opportunites).id,


montant:
faker.number.float({
min:10000,
max:10000000
}),


tva:20,


remise:
faker.number.float({
min:0,
max:10
}),


statut:
faker.helpers.arrayElement([
"Payée",
"Impayée",
"Brouillon"
]),


dateEcheance:
faker.date.future()


}

});



for(let j=0;j<3;j++){


const produit =
faker.helpers.arrayElement(produits);



await prisma.factureLigne.create({

data:{


factureId:facture.id,


produitId:produit.id,


quantite:
faker.number.int({
min:1,
max:20
}),


prix:
produit.prixVente


}

});


}


}


}









async function createMouvements(produits:any[]){

console.log("Création mouvements stock...");


for(let i=0;i<1000;i++){


await prisma.mouvement.create({

data:{


produitId:
faker.helpers.arrayElement(produits).id,


type:
faker.helpers.arrayElement([
"ENTREE",
"SORTIE"
]),


quantite:
faker.number.int({
min:1,
max:100
}),


commentaire:
"Créé automatiquement par seed"

}

});


}


}








async function main(){


console.log("Début Seed CRM PRO");


console.log("Nettoyage base de test...");

await prisma.factureLigne.deleteMany();
await prisma.facture.deleteMany();
await prisma.opportunite.deleteMany();

await prisma.mouvement.deleteMany();
await prisma.produit.deleteMany();

await prisma.categorie.deleteMany();
await prisma.fournisseur.deleteMany();

await prisma.client.deleteMany();

console.log("Base nettoyée");




await createAdmin();


const categories =
await createCategories();


const fournisseurs =
await createFournisseurs();


const produits =
await createProduits(
categories,
fournisseurs
);


const clients =
await createClients();


const opportunites =
await createOpportunites(clients);


await createFactures(
clients,
opportunites,
produits
);


await createMouvements(produits);



console.log("Seed terminé avec succès");


}







main()

.catch((e)=>{

console.error(e);

process.exit(1);

})

.finally(async()=>{

await prisma.$disconnect();

});