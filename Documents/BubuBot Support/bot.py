import discord, sqlite3
import bot
from discord.ext import commands
from discord import app_commands

db = sqlite3.connect(database="database.db")


client = commands.Bot(command_prefix="q", intents=discord.Intents.all())

@client.event
async def on_ready():
    try:
        synced = await client.tree.sync()
        print("Conectado como:\n{}#{}".format(client.user.name, client.user.discriminator))
        print("Sincronizados {} comandos".format(len(synced)))

    except discord.RateLimited:
        pass




reportes = 1
denuncias = 1
cursor = db.cursor()



@client.event
async def on_message(message:discord.Message):
    guild = message.guild

    cursor.execute("""SELECT mensaje FROM bugs WHERE servidor = 1038484670326779945""")

    res = cursor.fetchall()

    msg = res[0][0]

    if not guild:

        cursor.execute("""SELECT activo FROM bugs WHERE servidor = 1038484670326779945""")
        active = cursor.fetchone()

        inti = active

        if inti == 0:
            return await message.author.send("""Los reportes por MD están desactivados""")

        elif inti == 1:
            pass

        em = discord.Embed(title="Vas a realizar un reporte", description="Estás a punto de realizar un reporte con el contexto de:\n```\n{}```\n\nEl mensaje que es, ¿una denuncia o un reporte de error?".format(message.content))

        report = discord.Embed(description=msg, color=discord.Color.random())

        class Confirmacion(discord.ui.View):
            @discord.ui.button(label="Bug", style=discord.ButtonStyle.blurple, row=0)
            async def first_button_callback(self, interaction:discord.Interaction, button:discord.ui.Button):
                report.title = "Bug Reportado"
                canal = await client.fetch_channel(1043498666033430538)
    


                num_reps = bot.reportes

                bot.reportes = num_reps+1
        



                bug = discord.Embed(title="Reporte de bugs Nº {}".format(num_reps), description="```\n{}```".format(message.content), color=discord.Color.random())
                bug.set_footer(text="Reporte realizado por: | {}#{}".format(message.author.name, message.author.discriminator), icon_url=str(message.author.display_avatar.url))

                await canal.send(embeds=[bug])

                await interaction.response.send_message(embeds=[report])   

            @discord.ui.button(label="Denuncia",style=discord.ButtonStyle.blurple, row=0)
            async def second_button_callback(self, interaction:discord.Interaction, button:discord.ui.Button):
                report.title = "Denuncia Reportada"
                canal = await client.fetch_channel(1038484674424614913)

                num_den = bot.denuncias

                bot.denuncias = num_den+1


                den = discord.Embed(title="Denuncia Nº {}".format(num_den), description="```\n{}```".format(message.content), color=discord.Color.random())
                den.set_footer(text="Denuncia realizada por: | {}#{}".format(message.author.name, message.author.discriminator), icon_url=str(message.author.display_avatar.url))


                await canal.send(embeds=[den])
                await interaction.response.send_message(embeds=[report])

            @discord.ui.button(label="Cancelar reporte", style=discord.ButtonStyle.danger, row=0)
            async def third_button_callback(self, interaction:discord.Interaction, button:discord.ui.Button):
                await interaction.response.edit_message(view=None, content="El reporte se ha cancelado", embeds=None)

        await message.author.send(embeds=[em], view=Confirmacion())



@client.tree.command(name="settings")
@app_commands.guild_only()
@app_commands.default_permissions(administrator=True)
async def _l_view(ctx:discord.Interaction):

    cursor.execute("SELECT * FROM bugs WHERE servidor = {}".format(ctx.guild.id))

    results = cursor.fetchall()

    if IndexError in results:
        
        return await ctx.response.send_message("Se han creado tus ajustes, vuelve a usar el comando para verlos.", ephemeral=True)

    if(len(results) == 0):
            
        cursor.execute("""INSERT INTO bugs VALUES({}, 0, '¡Gracias por reportar el error, se ha enviado al canal de errores para que sea solucionado!')""".format(ctx.guild.id))

        results = cursor.fetchall()

    
    activo = results[0][1]
    msg = results[0][2]

    valor_a = "..."

    if activo == 1:
        valor_a = "Sí"

    elif activo == 0:
        valor_a = "No"


    embed = discord.Embed(title="Configuración", color=discord.Color.random())
    embed.add_field(name="Reportes Activos:", value=valor_a)
    embed.add_field(name="Mensaje:", value=str(msg))

    await ctx.response.send_message(embeds=[embed], ephemeral=True)


@_l_view.error
async def setting_error(ctx:discord.Interaction, error):
    await ctx.response.send_message("Se han creado tus ajustes, vuelve a usar el comando para verlos", ephemeral=True)

@client.tree.command(name="set-bug-message")
@app_commands.guild_only()
@app_commands.default_permissions(administrator=True)
async def _set_msg(ctx:discord.Interaction):

    class Modal(discord.ui.Modal, title="Establecer mensaje"):

        msg = discord.ui.TextInput(label="Nuevo mensaje", required=True, style=discord.TextStyle.long)

        async def on_submit(self, interaction: discord.Interaction):
            cursor.execute("""UPDATE bugs SET mensaje = '{}' WHERE servidor = {}""".format(self.msg, interaction.guild.id))
            await interaction.response.send_message("¡Mensaje nuevo establecido!\n```\n{}```".format(self.msg), ephemeral=True)


    class Buttons(discord.ui.View):
        @discord.ui.button(label="Ver mensaje actual", style=discord.ButtonStyle.blurple, row=0)
        async def first_button_callback(self, interaction:discord.Interaction, button:discord.Button):
            try:
                cursor.execute("""SELECT mensaje FROM bugs WHERE servidor = {}""".format(interaction.guild.id))
                res = cursor.fetchall()

                msg = res[0][0]

            except: return await interaction.response.send_message("```\n¡Gracias por reportar el error, se ha enviado al canal de errores para que sea solucionado!```", ephemeral=True)

            await interaction.response.send_message(content="```\n{}```".format(msg), ephemeral=True)

        @discord.ui.button(label="Establecer mensaje", style=discord.ButtonStyle.blurple, row=0)
        async def second_button_callback(self, interaction:discord.Interaction, button:discord.Button):
            await interaction.response.send_modal(Modal())

    await ctx.response.send_message("Elige que quieres hacer con el mensaje de reportes de bugs:", view=Buttons(), ephemeral=True)

@client.tree.command(name="set-bug-reports")
@app_commands.guild_only()
@app_commands.default_permissions(administrator=True)
async def _set_act(ctx:discord.Interaction):
    class Buttons(discord.ui.View):
        @discord.ui.button(label="Activar", style=discord.ButtonStyle.success, row=0)
        async def first_button_callback(self, interaction:discord.Interaction, button:discord.Button):
            try:
                cursor.execute("""UPDATE bugs SET activo = 1 WHERE servidor = {}""".format(interaction.guild.id))
            except:
                cursor.execute("""INSERT INTO bugs VALUS ({}, 1, '¡Gracias por reportar el error, se ha enviado al canal de errores para que sea solucionado!')""")
                return await interaction.response.edit_message(view=Cambioopinion(), content="Se han actualizado tus ajustes.\nReportes de bugs:\n```\nActivos```")

            await interaction.response.edit_message(view=Cambioopinion(), content="Se han actualizado tus ajustes.\nReportes de bugs:\n```\nActivos```")


        @discord.ui.button(label="Desactivar", style=discord.ButtonStyle.danger, row=0)
        async def second_button_callback(self, interaction:discord.Interaction, button:discord.Button):
            try:
                cursor.execute("""UPDATE bugs SET activo = 0 WHERE servidor = {}""".format(interaction.guild.id))
            except:
                cursor.execute("""INSERT INTO bugs VALUS ({}, 0, '¡Gracias por reportar el error, se ha enviado al canal de errores para que sea solucionado!')""")
                return await interaction.response.edit_message(view=Cambioopinion(), content="Se han actualizado tus ajustes.\nReportes de bugs:\n```\nActivos```")

            await interaction.response.edit_message(view=Cambioopinion(), content="Se han actualizado tus ajustes.\nReportes de bugs:\n```\nInactivos```")


    class Cambioopinion(discord.ui.View):
        @discord.ui.button(label="Aceptar", style=discord.ButtonStyle.success)
        async def first_button_callback(self, interaction:discord.Interaction, button:discord.Button):
            await interaction.response.edit_message(view=None)

        @discord.ui.button(label="Cambiar ajuste", style=discord.ButtonStyle.red)
        async def second_button_callback(self, interaction:discord.Interaction, button:discord.Button):
            await interaction.response.edit_message(content="Elige que quieres hacer con los reportes de bugs:", view=Buttons())

    await ctx.response.send_message("Elige que quieres hacer con los reportes de bugs:", view=Buttons(), ephemeral=True)

            


client.run("MTA0Mzk2NzM1MTcyMjM1Njc2OA.Gn37FS.jNQcuJzNu-5waIOep4PvFaE2Vj-_LvpoflFAH4")