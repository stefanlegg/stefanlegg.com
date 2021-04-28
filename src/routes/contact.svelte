<script>
    import { form as svelteForm, bindClass } from "svelte-forms";

    let name = "";
    let email = "";
    let message = "";
    let honeypot = "";
    let submitted = false;
    let formError = false;

    const contactForm = svelteForm(() => ({
        name: { value: name, validators: ["required"] },
        email: { value: email, validators: ["required", "email"] },
        message: { value: message, validators: ["required"] },
    }));

    const handleSubmit = (event) => {
        fetch("https://worker.stefanlegg.com/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                name,
                message,
                honeypot,
            }),
        })
            .then(() => {
                submitted = true;
            })
            .catch((error) => {
                formError = true;
            });
    };
</script>

<svelte:head>
    <title>Stefan Legg - Contact</title>
</svelte:head>

<div class="center">
    <h1>Contact</h1>

    {#if submitted}
        <div class="thanks center">
            <h3>Thanks for reaching out!</h3>
        </div>
    {:else}
        <form name="contact" on:submit|preventDefault={handleSubmit} method="POST">
            <p class="hidden">
                <label>
                    Don’t fill this out if you’re human:
                    <input name="honeypot" bind:value={honeypot} />
                </label>
            </p>
            <div class="fields">
                <p>
                    <label for="name">Name</label>
                    <input type="text" bind:value={name} use:bindClass={{ form: contactForm }} id="name" name="name" placeholder="Jane" required aria-required="true" />
                </p>
                <p>
                    <label for="email">Email Address</label>
                    <input
                        type="email"
                        bind:value={email}
                        use:bindClass={{ form: contactForm }}
                        id="email"
                        name="email"
                        placeholder="jane@gmail.com"
                        required
                        aria-required="true"
                    />
                </p>
            </div>
            <label for="message">Your Message</label>
            <textarea bind:value={message} use:bindClass={{ form: contactForm }} id="message" name="message" rows="5" required aria-required="true" />
            <div>
                <button type="submit" name="submit" disabled={!$contactForm.valid}>Submit</button>
                {#if formError}
                    <span class="error-message">
                        Something went wrong... <a
                            href="https://twitter.com/intent/tweet?text=@stefanlegg%20Hey%21%20Looks%20like%20your%20contact%20form%20is%20broken%20%e2%98%b9%ef%b8%8f"
                            >want to let me know on Twitter?</a
                        >
                    </span>
                {/if}
            </div>
        </form>
    {/if}
</div>

<style>
    form {
        background-color: rgba(34, 45, 61, 0.4);
        transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
        transition: all 0.2s ease-in-out;
        width: 100%;
        height: 100%;
        min-height: inherit;
        padding: 40px;
    }

    p {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    h3 {
        margin-bottom: 0;
    }

    label {
        color: var(--fg);
        display: block;
        font-weight: 700;
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
    }

    input,
    textarea {
        display: block;
        width: 100%;
        background-color: rgb(13, 17, 23);
        border: 1px solid rgba(56, 138, 252, 0.2);
        font-size: 1rem;
        font-weight: 500;
        padding: 0.5rem 1rem;
        box-sizing: border-box;
    }

    textarea {
        resize: vertical;
        margin-block-end: 1em;
        margin-inline-end: 0px;
    }

    input:focus,
    textarea:focus {
        outline: 1px solid var(--primary);
    }

    button {
        background-color: var(--primary);
        border-color: transparent;
        color: #fff;
        text-shadow: 0 1px 3px rgb(0 0 0 / 15%);
        transition: all 0.15s ease;
        vertical-align: middle;
        user-select: none;
        transition: all 0.2s ease-in-out;
        font-size: 0.875rem;
        padding: 0.75rem 1.5rem;
        border-radius: 0.25rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.025em;
    }

    button:focus,
    button:hover {
        background-color: var(--primary);
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .fields {
        display: grid;
        grid-template-columns: 1fr;
        grid-row-gap: 0;
        grid-column-gap: 2rem;
    }

    @media (min-width: 670px) {
        .fields {
            grid-template-columns: repeat(2, 1fr);
            grid-row-gap: 1rem;
        }
    }

    .thanks {
        background-color: rgba(34, 45, 61, 0.4);
        width: 100%;
        height: 100%;
        min-height: inherit;
        padding: 40px;
    }

    .center {
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .hidden {
        display: none;
    }

    .error-message {
        margin-left: 10px;
    }

    @media (max-width: 800px) {
        .error-message {
            display: block;
            margin: 20px 0 0 0;
            width: 100%;
            text-align: center;
        }
    }
</style>
